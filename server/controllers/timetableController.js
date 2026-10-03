const timetableRepository = require('../repositories/timetableRepository');

exports.getTimetable = async (req, res) => {
  try {
    const timetable = await timetableRepository.findAll();
    res.json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTimetable = async (req, res) => {
  try {
    const timetable = await timetableRepository.create(req.body);
    res.status(201).json({ success: true, data: timetable, message: 'Timetable entry added' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
