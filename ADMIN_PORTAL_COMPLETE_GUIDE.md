# ZenYourLife Admin Portal
## Complete User Guide & Documentation

---

**Version:** 1.0
**Last Updated:** December 2024
**Platform:** Web-based Admin Portal

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard](#2-dashboard)
3. [Massage Appointments](#3-massage-appointments)
4. [Booking Management](#4-booking-management)
5. [Inquiries](#5-inquiries)
6. [Properties](#6-properties)
7. [Services](#7-services)
8. [Testimonials](#8-testimonials)
9. [Automatic Reminder System](#9-automatic-reminder-system)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Getting Started

### 1.1 Login Credentials

| Field | Value |
|-------|-------|
| **Email** | admin@zenyourlife.be |
| **Password** | admin12345 |

### 1.2 How to Login

1. Open your web browser and navigate to the admin portal URL
2. Enter your **email address** in the "Username or Email" field
3. Enter your **password** in the "Password" field
4. Click the **"Log In"** button
5. You will be redirected to the Dashboard

### 1.3 Navigation

The admin portal uses a **sidebar navigation** on the left side of the screen.

| Menu Item | Description |
|-----------|-------------|
| Dashboard | Overview of all appointments and statistics |
| Massage Appointments | Manage massage bookings |
| Booking Management | Configure time slots and block dates |
| Inquiries | View customer contact messages |
| Properties | Manage rental property listings |
| Services | Manage massage/wellness services |
| Testimonials | Manage customer reviews |

### 1.4 Logging Out

1. Scroll to the bottom of the sidebar
2. Click **"Sign Out"** button
3. You will be redirected to the login page

---

## 2. Dashboard

The Dashboard is your central hub for monitoring business performance at a glance.

### 2.1 What You'll See

#### Welcome Banner
A golden banner at the top showing today's quick stats:
- **Upcoming** - Number of appointments scheduled for today
- **Pending** - Appointments awaiting confirmation
- **Confirmed** - Percentage of confirmed appointments

#### Statistics Cards

| Card | Description | Icon Color |
|------|-------------|------------|
| **Total Appointments** | Total number of massage appointments in the system | Yellow with "Massage" label |
| **Upcoming Bookings** | Appointments scheduled for the next 7 days | Blue with "7 Days" label |
| **Awaiting Confirmation** | Appointments that need your attention | Green with "Action" label |
| **All Time Bookings** | Historical count of all bookings | Green with "100%" label |

#### Recent Massage Bookings
A list showing the latest appointments with:
- Customer name
- Appointment date and time
- Service booked
- Status indicator

### 2.2 Available Actions

| Action | How to Do It |
|--------|--------------|
| View all appointments | Click **"View All"** button next to Recent Massage Bookings |
| Refresh data | The dashboard automatically refreshes, or reload the page |

---

## 3. Massage Appointments

This is the main section for managing all massage and wellness service bookings.

### 3.1 Page Layout

The page is divided into two sections:
- **Left Panel**: List of all bookings with filters and search
- **Right Panel**: Detailed view of selected booking

### 3.2 Viewing Appointments

1. Navigate to **Massage Appointments** in the sidebar
2. You'll see a list of all bookings in the left panel
3. Click on any booking to view full details in the right panel

### 3.3 Filtering Appointments

Use the filter tabs at the top of the booking list:

| Filter Tab | What It Shows |
|------------|---------------|
| **All** | All appointments regardless of status |
| **Pending** | Appointments awaiting confirmation (yellow status) |
| **Confirmed** | Approved appointments (green status) |
| **Done** | Completed appointments (blue status) |

### 3.4 Searching Appointments

1. Locate the **search bar** at the top of the page
2. Type any of the following to search:
   - Customer name
   - Appointment ID
   - Service name
   - Email address
3. Results filter in real-time as you type

### 3.5 Creating a New Appointment

This feature allows you to create an appointment directly from the admin panel (e.g., for walk-in customers or phone bookings).

**Step-by-step:**

1. Click the **"+ New"** button (top right corner, golden color)
2. A modal window will open with the following sections:

#### Customer Information Section
| Field | Description | Required |
|-------|-------------|----------|
| First Name | Customer's first name | Yes |
| Last Name | Customer's last name | Yes |
| Email | Customer's email address (for confirmation emails) | Yes |
| Phone | Customer's phone number with country code | Yes |
| Country | Select from dropdown | Yes |
| Gender | Click Male, Female, or Other button | Yes |

#### Service Selection Section
| Field | Description | Required |
|-------|-------------|----------|
| Service | Select from dropdown showing service name, price, and duration | Yes |

#### Appointment Details Section
| Field | Description | Required |
|-------|-------------|----------|
| Date | Select appointment date using date picker | Yes |
| Time | Select appointment time | Yes |

#### Additional Information Section (Optional)
| Field | Description | Required |
|-------|-------------|----------|
| Special Requests | Any special requests from the customer | No |
| Message | Additional notes | No |

3. Click **"Create Appointment"** button to save
4. The appointment will be created and confirmation emails will be sent

### 3.6 Viewing Appointment Details

When you click on an appointment, the right panel shows:

| Section | Information Displayed |
|---------|----------------------|
| **Header** | Customer name, status badge, appointment ID |
| **Contact Info** | Email and phone number |
| **Appointment Info** | Date, time, and day of week |
| **Service Info** | Service name and details |
| **Timeline** | Created date and last updated date |
| **Messages** | Special requests and notes |

### 3.7 Managing Appointment Status

In the appointment detail view, you can change the status using the action buttons:

| Button | Action | When to Use |
|--------|--------|-------------|
| **Confirm** | Changes status to "Confirmed" | After verifying the booking |
| **Complete** | Changes status to "Completed/Done" | After the service is delivered |
| **Send Message** | Opens email/contact option | To communicate with customer |

### 3.8 Deleting an Appointment

1. Select the appointment from the list
2. Click the **trash icon** (delete button)
3. A confirmation dialog will appear asking "Are you sure?"
4. Click **"Delete"** to confirm or **"Cancel"** to go back
5. The appointment will be permanently removed

**Warning:** This action cannot be undone!

### 3.9 Status Colors Guide

| Color | Status | Meaning |
|-------|--------|---------|
| Yellow/Amber | Pending | Needs attention/confirmation |
| Green | Confirmed | Approved and scheduled |
| Blue | Completed | Service has been delivered |
| Red | Cancelled | Appointment was cancelled |

---

## 4. Booking Management

This section controls your availability and scheduling settings.

### 4.1 Overview

Booking Management allows you to:
- View and manage time slots for each day
- Block specific dates when you're unavailable
- Block specific time slots on certain dates
- Set weekly schedule patterns

### 4.2 Viewing the Calendar

1. Navigate to **Booking Management** in the sidebar
2. You'll see a calendar view showing:
   - Available dates (normal color)
   - Blocked dates (grayed out or marked)
   - Days with blocked time slots (partially marked)

### 4.3 Blocking Full Dates

When you won't be available for an entire day (vacation, holiday, etc.):

1. Click on the date you want to block
2. Select **"Block Full Day"** option
3. Confirm the action
4. The date will now show as unavailable to customers

**Result:** Customers cannot book any appointments on this date.

### 4.4 Blocking Specific Time Slots

When you're only unavailable during certain hours:

1. Click on the date
2. Select **"Block Time Slots"** option
3. Choose the specific time slots to block (e.g., 12:30, 1:30, 2:30)
4. Save your changes

**Result:** Only the selected time slots will be unavailable; other times remain bookable.

### 4.5 Unblocking Dates/Time Slots

1. Click on the blocked date
2. Select **"Unblock"** option
3. Choose to unblock the entire day or specific time slots
4. Confirm the action

### 4.6 Weekend Settings

By default, **Saturday and Sunday** are set as non-working days:
- They appear with a crossed-out indicator
- Customers cannot book appointments on weekends
- You can change this in the settings if you work on weekends

### 4.7 Available Time Slots

The default time slots are:
- 12:30
- 1:30
- 2:30
- 3:30
- 4:30
- 5:30

---

## 5. Inquiries

Manage customer contact messages from both the massage website and rental website.

### 5.1 Page Layout

The page has two tabs at the top:
- **Massage Inquiries** - Messages from the massage/wellness website
- **Rental Inquiries** - Messages from the rental property website

### 5.2 Switching Between Tabs

1. Click on **"Massage Inquiries"** tab to view massage-related messages
2. Click on **"Rental Inquiries"** tab to view rental-related messages

### 5.3 Viewing Inquiries

Each inquiry card shows:

| Information | Description |
|-------------|-------------|
| **Customer Name** | Full name of the person who submitted the inquiry |
| **Email** | Email address for response |
| **Phone** | Phone number (if provided) |
| **Subject** | Topic or subject of the inquiry |
| **Message** | Full message content |
| **Date** | When the inquiry was submitted |
| **Status** | New, Read, or Replied |

### 5.4 Managing Inquiries

| Action | How to Do It |
|--------|--------------|
| **View full message** | Click on the inquiry card |
| **Mark as read** | Click the checkmark or "Mark Read" button |
| **Delete inquiry** | Click the trash icon on the inquiry |
| **Reply** | Note the customer's email and respond via your email client |

### 5.5 Filtering Inquiries

Use the filter dropdown to show:
- **All** - All inquiries
- **New/Unread** - Only unread messages
- **Read** - Already viewed messages

### 5.6 Searching Inquiries

Use the search bar to find inquiries by:
- Customer name
- Email address
- Subject line
- Message content

---

## 6. Properties

Manage rental property listings displayed on the rental website.

### 6.1 Page Overview

The Properties page shows:
- **Statistics Cards** at the top (Total Properties, Active Listings, Avg. Price, Total Capacity)
- **Section Configuration Banner** for customizing the website section
- **Property Listings** in grid or list view

### 6.2 Statistics Cards

| Card | Description |
|------|-------------|
| **Total Properties** | Number of all properties in the system |
| **Active Listings** | Properties visible on the website |
| **Avg. Price/Night** | Average nightly rate across all properties |
| **Total Capacity** | Combined guest capacity of all properties |

### 6.3 View Modes

Toggle between two view modes using the buttons:

| Mode | Icon | Description |
|------|------|-------------|
| **Grid View** | Grid icon | Shows properties as cards in a grid layout |
| **List View** | List icon | Shows properties in a horizontal list format |

### 6.4 Adding a New Property

1. Click the **"+ Add Property"** button (golden color, top right)
2. Fill in the property details:

#### Basic Information
| Field | Description | Required |
|-------|-------------|----------|
| Property Name | Name of the property (e.g., "Lanzarote Beachfront Villa") | Yes |
| Description | Detailed description of the property | Yes |

#### Pricing
| Field | Description | Required |
|-------|-------------|----------|
| Price | Nightly rate | Yes |
| Currency | EUR (€), USD ($), or GBP (£) | Yes |
| Per | Night, Week, or Month | Yes |

#### Capacity & Features
| Field | Description | Required |
|-------|-------------|----------|
| Guests | Maximum number of guests | Yes |
| Bedrooms | Number of bedrooms | Yes |
| Parking | Parking availability (e.g., "2 cars") | No |

#### Property Image
You have three options:
1. **Upload Image**: Drag & drop or click to upload from your computer
2. **Image URL**: Paste a URL to an image hosted online
3. **Default Images**: Select from pre-designed property images

#### Amenities
1. Type an amenity in the input field (e.g., "WiFi", "Pool", "Air Conditioning")
2. Press **Enter** or click the **+** button to add
3. Click the **X** on any amenity tag to remove it

#### Host Name (Optional)
Enter the host's name to display on the website

3. Click **"Add Property"** button to save

### 6.5 Editing a Property

1. Find the property in the list
2. Click the **Edit icon** (pencil) on the property card
3. Modify the details in the modal
4. Click **"Update Property"** to save changes

### 6.6 Showing/Hiding a Property

To control whether a property appears on the website:

1. Find the property
2. Click the **Eye icon** to toggle visibility:
   - **Eye (open)**: Property is visible on website
   - **Eye (crossed)**: Property is hidden from website

### 6.7 Deleting a Property

1. Find the property
2. Click the **Trash icon** (red)
3. Confirm the deletion in the popup
4. The property will be permanently removed

**Warning:** This action cannot be undone!

### 6.8 Section Configuration

Customize how the properties section appears on the website:

1. Click **"Edit Settings"** in the dark banner
2. Modify:
   - **Section Title**: Heading displayed on the website (e.g., "Our Apartments")
   - **Section Description**: Subtext below the title
3. Click **"Save Settings"**

### 6.9 Filtering Properties

Use the filter dropdown:

| Option | Shows |
|--------|-------|
| All Properties | Everything |
| Active Only | Only visible properties |
| Hidden Only | Only hidden properties |

---

## 7. Services

Manage the massage and wellness services offered on the website.

### 7.1 Page Overview

The Services page displays:
- **Search bar** for finding services
- **Service cards** showing all available services
- **Add button** for creating new services

### 7.2 Service Card Information

Each service card shows:

| Field | Description |
|-------|-------------|
| **Title** | Name of the service |
| **Description** | Brief description |
| **Duration** | Length of service in minutes |
| **Price** | Cost in EUR |
| **Category** | Service category (e.g., Massage, Wellness) |
| **Status** | Active or Inactive |
| **Image** | Service image or default |

### 7.3 Adding a New Service

1. Click **"+ Add Service"** button
2. Fill in the service details:

| Field | Description | Required |
|-------|-------------|----------|
| Title | Service name (e.g., "Swedish Massage") | Yes |
| Description | What the service includes | Yes |
| Duration | Time in minutes (e.g., 60) | Yes |
| Price | Cost in EUR | Yes |
| Category | Select or type a category | Yes |

3. Choose an image for the service (upload or select default)
4. Set the status to **Active** to display on website
5. Click **"Save Service"**

### 7.4 Editing a Service

1. Find the service card
2. Click the **Edit** button
3. Modify the details
4. Click **"Update Service"**

### 7.5 Activating/Deactivating a Service

To control whether a service is bookable:

1. Find the service
2. Click the **Active/Inactive** toggle
3. Changes take effect immediately

**Active**: Service appears on booking page
**Inactive**: Service is hidden from customers

### 7.6 Deleting a Service

1. Find the service
2. Click the **Delete** (trash) icon
3. Confirm deletion
4. Service is permanently removed

**Note:** Deleting a service does not affect existing appointments.

---

## 8. Testimonials

Manage customer reviews and feedback displayed on the website.

### 8.1 Page Overview

The page has two tabs:
- **Massage Testimonials** - Reviews for massage services
- **Rental Testimonials** - Reviews for rental properties

### 8.2 Statistics

| Stat | Description |
|------|-------------|
| **Total Reviews** | Number of testimonials in the system |
| **Active Reviews** | Reviews currently visible on website |
| **Average Rating** | Mean star rating across all reviews |

### 8.3 Adding a New Testimonial

1. Click **"+ Add Testimonial"** button (golden)
2. Fill in the testimonial details:

| Field | Description | Required |
|-------|-------------|----------|
| Customer Name | Name to display | Yes |
| Role/Handle | Title or social handle (e.g., "@johndoe") | No |
| Testimonial Text | The review content | Yes |
| Rating | Click stars 1-5 | Yes |
| Avatar | Select from pre-designed avatars or add custom URL | Yes |
| Visibility | Toggle to show/hide on website | Yes |

3. Click **"Save Testimonial"**

### 8.4 Rating Selection

Click on the stars to set the rating:
- **1 Star**: Poor
- **2 Stars**: Fair
- **3 Stars**: Good
- **4 Stars**: Very Good
- **5 Stars**: Excellent

### 8.5 Avatar Options

Choose from:
1. **Avatar 1-4**: Pre-designed colored avatars
2. **Custom Photo URL**: Enter a URL to a customer photo

### 8.6 Editing a Testimonial

1. Find the testimonial card
2. Click **"Edit"** button
3. Modify the content
4. Click **"Save Testimonial"**

### 8.7 Showing/Hiding a Testimonial

Control visibility without deleting:

1. Find the testimonial
2. Click the **Active/Inactive** badge or **Show/Hide** button
3. Toggle switches the visibility

### 8.8 Deleting a Testimonial

1. Find the testimonial
2. Click **"Delete"** button
3. Confirm deletion
4. Testimonial is permanently removed

### 8.9 Seeding Demo Data

If you need sample testimonials for testing:

1. Click **"Seed Demo"** button
2. Pre-written testimonials will be added to the system
3. You can edit or delete these afterward

### 8.10 Filtering Testimonials

Use the filter dropdown:

| Option | Shows |
|--------|-------|
| All Status | All testimonials |
| Active | Only visible reviews |
| Inactive | Only hidden reviews |

---

## 9. Automatic Reminder System

The system automatically sends reminder emails to customers and admin.

### 9.1 How It Works

| Reminder Type | Recipient | When Sent |
|---------------|-----------|-----------|
| **Customer Reminder** | Customer's email | 1 day before appointment at 9:00 AM |
| **Admin Reminder** | Admin email | 15 minutes before appointment time |

### 9.2 Customer Reminder Email

Sent automatically the day before an appointment:
- Subject: "Don't Forget! Your Massage Appointment Tomorrow"
- Contains:
  - Customer name
  - Appointment date and time
  - Service booked
  - Location/contact info

### 9.3 Admin Reminder Email

Sent automatically 15 minutes before each appointment:
- Subject: "Upcoming Appointment in 15 Minutes"
- Contains:
  - Customer name and contact info
  - Service to be provided
  - Any special requests

### 9.4 Important Notes

- Reminders are **automatic** - no action required from you
- The customer must have chosen "Email" as their reminder preference during booking
- Make sure your server is running for reminders to be sent
- Reminders are only sent once per appointment

---

## 10. Troubleshooting

### 10.1 Login Issues

**Problem:** Can't log in

**Solutions:**
1. Verify email: `admin@zenyourlife.be`
2. Verify password: `admin12345`
3. Check Caps Lock is OFF
4. Clear browser cache and try again
5. Try a different browser

### 10.2 Appointments Not Showing

**Problem:** Appointments list is empty or missing entries

**Solutions:**
1. Check your filter settings - ensure "All" is selected
2. Clear the search box if you've searched for something
3. Refresh the page (F5 or Ctrl+R)
4. Check if backend server is running

### 10.3 Time Slots Not Available for Customers

**Problem:** Customers can't see any available time slots

**Solutions:**
1. Check **Booking Management** for blocked dates
2. Verify time slots aren't all blocked for that date
3. Check if the date is a Saturday/Sunday (blocked by default)
4. Ensure some slots aren't already booked

### 10.4 Emails Not Being Sent

**Problem:** Confirmation or reminder emails aren't arriving

**Solutions:**
1. Check spam/junk folder
2. Verify the backend server is running
3. Check email configuration in server settings
4. Verify customer entered correct email address

### 10.5 Images Not Uploading

**Problem:** Property or service images fail to upload

**Solutions:**
1. Check file size (max 5MB)
2. Ensure file is an image (PNG, JPG, JPEG, GIF)
3. Try a different image
4. Use the URL option instead

### 10.6 Changes Not Saving

**Problem:** Edits don't persist after saving

**Solutions:**
1. Check for error messages on screen
2. Ensure all required fields are filled
3. Verify internet connection
4. Refresh and try again

### 10.7 Page Loading Slowly

**Problem:** Admin portal is slow or unresponsive

**Solutions:**
1. Refresh the page
2. Clear browser cache
3. Check internet connection
4. Try a different browser
5. Reduce the number of open browser tabs

---

## Quick Reference Card

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| F5 | Refresh page |
| Ctrl + F | Find on page |
| Esc | Close modal/dialog |

### Status Color Legend

| Color | Meaning |
|-------|---------|
| Yellow/Amber | Pending / Needs attention |
| Green | Active / Confirmed / Success |
| Blue | Completed / Info |
| Red | Cancelled / Error / Delete |
| Gray | Inactive / Disabled |

### Common Button Icons

| Icon | Meaning |
|------|---------|
| + (Plus) | Add new item |
| Pencil | Edit item |
| Trash | Delete item |
| Eye | Toggle visibility / View |
| Check | Confirm / Approve |
| X | Cancel / Close |
| Filter | Filter options |
| Search | Search functionality |

---

## Contact & Support

For technical support or questions:

- **Admin Email:** admin@zenyourlife.be
- **Website:** www.zenyourlife.be
- **GitHub Issues:** https://github.com/Synquic/zenyourlife/issues

---

*This documentation covers all features of the ZenYourLife Admin Portal. For additional help, please contact support.*
