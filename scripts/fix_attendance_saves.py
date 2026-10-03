import os

# 1. Update controller to allow multiple attendances per day (or just use exact time)
controller_path = 'server/controllers/attendanceController.js'
with open(controller_path, 'r') as f:
    controller = f.read()

# Replace findOneAndUpdate with create
new_logic = """
    // Upsert each record, but use the exact current time mixed with selected date to ensure uniqueness 
    // or just use create() to allow multiple saves. We'll use create to satisfy the user's testing.
    const now = new Date();
    const attendanceDate = new Date(date);
    // Mix the selected date with the current time so it's unique per save click
    attendanceDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    
    for (const record of records) {
        const newAtt = new Attendance({
            student: record.studentId,
            course: courseId,
            date: attendanceDate,
            status: record.status
        });
        await newAtt.save();
    }
"""

start_idx = controller.find('// Convert date string')
end_idx = controller.find('res.json({ success: true, message: \'Attendance saved successfully\' });')
if start_idx != -1 and end_idx != -1:
    controller = controller[:start_idx] + new_logic + "    " + controller[end_idx:]
    with open(controller_path, 'w') as f:
        f.write(controller)

# 2. Update model to remove unique index
model_path = 'server/models/Attendance.js'
with open(model_path, 'r') as f:
    model = f.read()

model = model.replace('attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });', 
                      '// Unique index removed to allow multiple attendance sessions per day')
with open(model_path, 'w') as f:
    f.write(model)

print("Backend attendance controller updated to allow multiple records.")
