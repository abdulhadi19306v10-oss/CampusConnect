const announcementRepository = require('../repositories/announcementRepository');

class AnnouncementService {
  async createAnnouncement(data) {
    return await announcementRepository.create(data);
  }

  async getAllAnnouncements() {
    return await announcementRepository.findAll();
  }

  async getPublishedAnnouncements() {
    return await announcementRepository.findPublished();
  }

  async deleteAnnouncement(id) {
    return await announcementRepository.delete(id);
  }
}

module.exports = new AnnouncementService();
