const announcementService = require('../services/announcementService');

exports.createAnnouncement = async (req, res) => {
  try {
    const data = { ...req.body, author: req.user.id };
    const announcement = await announcementService.createAnnouncement(data);
    res.status(201).json({ success: true, data: announcement, message: 'Announcement created' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPublished = async (req, res) => {
  try {
    const announcements = await announcementService.getPublishedAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
