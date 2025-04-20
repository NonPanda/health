const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');
const { isAuthenticated } = require('../middlewares/auth');
const nodemailer = require('nodemailer');
const User = require('../models/userModel'); // adjust the path as needed
const Doctor = require('../models/doctorModel'); // adjust the path as needed

// Configure your transporter (adjust settings per your email provider)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS  // your email password or app password
    }
});

// Helper: generate a Google Calendar link for the appointment event
const createGoogleCalendarLink = ({ title, start, end, details, location }) => {
    // Format dates as YYYYMMDDTHHmmssZ (Google Calendar uses RFC 3339 format)
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:.]/g, '').split('Z')[0] + 'Z';
    };
    const startStr = formatDate(new Date(start));
    const endStr = formatDate(new Date(end));
  
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
};

// Book an appointment
router.post('/book', isAuthenticated, async (req, res) => {
  try {
    const { user, doctor, appointmentDate, appointmentTime, consultationType } = req.body;
    
    // If appointmentDate already has a time component, use it; otherwise assume UTC midnight.
    const adjustedAppointmentDate = appointmentDate.includes("T")
      ? new Date(appointmentDate)
      : new Date(appointmentDate + "T00:00:00Z");

    // Create the appointment first.
    let appointment = await Appointment.create({
      doctor,
      user,
      appointmentDate: adjustedAppointmentDate,
      appointmentTime,
      consultationType  // "online" or "offline"
    });

    // Do NOT generate and send the online meeting link at booking.
    // (We'll create/send the link when the doctor approves the appointment)

    // Get user's email from database
    const dbUser = await User.findById(req.user);
    if (!dbUser || !dbUser.email) {
      return res.status(400).json({ success: false, error: "User email not found" });
    }
    const userEmail = dbUser.email;
    // Use Canadian date format
    const formattedDate = adjustedAppointmentDate.toLocaleDateString('en-CA');

    // Generate Google Calendar link (assume a 30-minute appointment)
    const eventTitle = 'Doctor Appointment';
    const startTime = new Date(adjustedAppointmentDate);
    const endTime = new Date(startTime.getTime() + 30 * 60000);
    const eventDetails = `Appointment at ${appointmentTime}. Waiting for doctor's approval.`;
    const eventLocation = 'Your Clinic Address';
    const googleCalendarUrl = createGoogleCalendarLink({
      title: eventTitle,
      start: startTime,
      end: endTime,
      details: eventDetails,
      location: eventLocation
    });

    // Build email HTML for the user without the join meeting link.
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Your Appointment is Pending Approval',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
          <h2 style="color: #3b82f6; margin: 0;">Appointment Confirmation</h2>
        </div>
        <div style="padding: 20px 0;">
          <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">Hello,</p>
          <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
            Your appointment on <strong>${formattedDate}</strong> at <strong>${appointmentTime}</strong> has been submitted.
          </p>
          <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
            Please note that your booking is awaiting the doctor's approval. We will notify you once it's confirmed.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${googleCalendarUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
              Add to Google Calendar
            </a>
          </div>
        </div>
        <div style="padding-top: 20px; border-top: 1px solid #eaeaea; color: #666; font-size: 14px;">
          <p>Thank you for choosing our services.</p>
          <p style="margin: 0;">Your Health Team</p>
        </div>
      </div>
      `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email to user:', err);
      }
    });

    // Similarly, send email to doctor (without join meeting link) if needed.
    const dbDoctor = await Doctor.findById(doctor);
    if (dbDoctor && dbDoctor.email) {
      const doctorMailOptions = {
        from: process.env.EMAIL_USER,
        to: dbDoctor.email,
        subject: 'New Appointment Booked - Approval Needed',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
            <h2 style="color: #3b82f6; margin: 0;">New Appointment Request</h2>
          </div>
          <div style="padding: 20px 0;">
            <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
              Hello Dr. ${dbDoctor.name || ''},
            </p>
            <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
              A new appointment has been booked for <strong>${formattedDate}</strong> at <strong>${appointmentTime}</strong>.
            </p>
            <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
              Please review and approve this appointment request.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${googleCalendarUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; margin-bottom: 15px;">
                Add to Google Calendar
              </a>
              <br>
              <a href="http://localhost:5173/appointments" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                Approve Appointment
              </a>
            </div>
          </div>
          <div style="padding-top: 20px; border-top: 1px solid #eaeaea; color: #666; font-size: 14px;">
            <p>Thank you for your attention.</p>
            <p style="margin: 0;">Your Health Team</p>
          </div>
        </div>
        `
      };

      transporter.sendMail(doctorMailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email to doctor:', err);
        }
      });
    } else {
      console.error("Doctor email not found");
    }

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error('Error in booking appointment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all appointments for the logged-in user (for patients)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // req.user._id should match the user field in Appointment
    const appointments = await Appointment.find({ user: req.user })
      .populate('doctor')
      .sort({ appointmentDate: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// For a doctor to view their appointments
router.get('/doctor', isAuthenticated, async (req, res) => {
  try {
    // req.user._id should match the doctor field in Appointment
    const appointments = await Appointment.find({ doctor: req.user })
      .populate('user')
      .sort({ appointmentDate: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve (update) an appointment – accessible by doctor only
router.put('/:id/approve', isAuthenticated, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    // Check if the logged-in doctor is the one assigned to the appointment
    if (appointment.doctor.toString() !== req.user.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to approve this appointment' });
    }
    // Update the status to 'confirmed'
    appointment.status = 'confirmed';

    // If the consultation is online, generate the meeting link at approval time.
    // This link will be sent to both the patient and the doctor.
    let meetingLink = null;
    if (appointment.consultationType === 'online') {
      meetingLink = `https://meet.jit.si/${appointment._id}`;
      appointment.meetingLink = meetingLink;
    }
    await appointment.save();

    // Get both the doctor and the patient
    const dbDoctor = await Doctor.findById(appointment.doctor);
    const dbUser = await User.findById(appointment.user);
    if (!dbDoctor || !dbDoctor.email || !dbUser || !dbUser.email) {
      return res.status(400).json({ success: false, error: "Doctor or User email not found" });
    }
    
    // Format appointment date using Canadian format
    const adjustedAppointmentDate = new Date(appointment.appointmentDate);
    const formattedDate = adjustedAppointmentDate.toLocaleDateString('en-CA');

    // Generate Google Calendar link (assume 30-minute duration)
    const eventTitle = 'Doctor Appointment';
    const startTime = new Date(appointment.appointmentDate);
    const endTime = new Date(startTime.getTime() + 30 * 60000);
    const eventDetails = `Appointment at ${appointment.appointmentTime} has been confirmed.`;
    const eventLocation = 'Your Clinic Address';
    const googleCalendarUrl = createGoogleCalendarLink({
      title: eventTitle,
      start: startTime,
      end: endTime,
      details: eventDetails,
      location: eventLocation
    });
    
    // Build email HTML for the patient
    // If consultation is online, include a "Join Online Meeting" button that instructs them to join at the appointment time.
    let userOnlineButton = '';
    if (appointment.consultationType === 'online' && meetingLink) {
      userOnlineButton = `
       <div style="text-align: center; margin: 20px 0;">
         <a href="${meetingLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
           Join Online Meeting at Appointment Time
         </a>
       </div>
      `;
    }
    
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: dbUser.email,
      subject: 'Appointment Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
            <h2 style="color: #3b82f6; margin: 0;">Appointment Confirmed</h2>
          </div>
          <div style="padding: 20px 0;">
            <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">Hello,</p>
            <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
              Your appointment on <strong>${formattedDate}</strong> at <strong>${appointment.appointmentTime}</strong> has been confirmed.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${googleCalendarUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                Add to Google Calendar
              </a>
            </div>
            ${userOnlineButton}
          </div>
          <div style="padding-top: 20px; border-top: 1px solid #eaeaea; color: #666; font-size: 14px;">
            <p>Thank you for choosing our services.</p>
            <p style="margin: 0;">Your Health Team</p>
          </div>
        </div>
      `
    };

    transporter.sendMail(userMailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email to user:', err);
      } else {
        // console.log('User email sent:', info.response);
      }
    });

    // Build email HTML for the doctor
    let doctorOnlineButton = '';
    if (appointment.consultationType === 'online' && meetingLink) {
      doctorOnlineButton = `
        <div style="text-align: center; margin: 20px 0;">
          <a href="${meetingLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            Join Online Meeting at Appointment Time
          </a>
        </div>
      `;
    }
    
    const doctorMailOptions = {
      from: process.env.EMAIL_USER,
      to: dbDoctor.email,
      subject: 'Appointment Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea;">
            <h2 style="color: #3b82f6; margin: 0;">Appointment Confirmed</h2>
          </div>
          <div style="padding: 20px 0;">
            <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
              Hello Dr. ${dbDoctor.name || ''},
            </p>
            <p style="margin-bottom: 20px; color: #333; line-height: 1.6;">
              The appointment for <strong>${formattedDate}</strong> at <strong>${appointment.appointmentTime}</strong> has been confirmed.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${googleCalendarUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                Add to Google Calendar
              </a>
            </div>
            ${doctorOnlineButton}
          </div>
          <div style="padding-top: 20px; border-top: 1px solid #eaeaea; color: #666; font-size: 14px;">
            <p>Thank you for your attention.</p>
            <p style="margin: 0;">Your Health Team</p>
          </div>
        </div>
      `
    };

    transporter.sendMail(doctorMailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email to doctor:', err);
      } else {
        // console.log('Doctor email sent:', info.response);
      }
    });

    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel appointment (for doctors)
router.put('/:id/cancel', isAuthenticated, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    // Ensure the logged-in doctor is the one assigned to the appointment
    if (appointment.doctor.toString() !== req.user.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to cancel this appointment' });
    }
    
    // Update the status to 'cancelled'
    appointment.status = 'cancelled';
    // Optionally, clear any meeting link if one exists
    appointment.meetingLink = null;
    await appointment.save();

    // (Optional) Send cancellation emails to both patient and doctor
    // For example, you can create mailOptions similar to the approval endpoint.
    // Here, we'll keep it simple and only return the updated appointment.

    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/doctor/:id/availability', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Expected format "YYYY-MM-DD"
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const appointments = await Appointment.find({
      doctor: id,
      appointmentDate: { $gte: start, $lte: end }
    });
    const bookedTimes = appointments.map(appt => appt.appointmentTime);
    res.json({ success: true, bookedTimes });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/doctor/:id/availability-check', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.query; // date format "YYYY-MM-DD", time as "h:mm AM/PM"
    if (!date || !time) {
      return res.status(400).json({ success: false, error: 'Date and time are required' });
    }
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    // Now doctor (id from req.params) is defined
    const appointment = await Appointment.findOne({
      doctor: id,
      appointmentDate: { $gte: start, $lte: end },
      appointmentTime: time
    });
    if (appointment) {
      return res.json({ success: true, available: false });
    } else {
      return res.json({ success: true, available: true });
    }
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;