const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(express.json());
app.set('view engine', 'ejs'); // Use EJS for templating
app.use(express.static('public')); // Serve static files (CSS)

const PORT = 5000;

// Home route - Display events and form
app.get('/', async (req, res) => {
    const events = await prisma.event.findMany({
        include: { Assignments: { include: { User: true, Machine: true } } }
    });
    const users = await prisma.user.findMany();
    const machines = await prisma.machine.findMany();
    res.render('index', { events, users, machines });
});

// Create event
app.post('/events', async (req, res) => {
    const { eventName, startDateTime, endDateTime, shiftAssignment, assignments } = req.body;
    const parsedAssignments = JSON.parse(assignments); // Expecting JSON string from form
    await prisma.event.create({
        data: {
            EventName: eventName,
            StartDateTime: new Date(startDateTime),
            EndDateTime: new Date(endDateTime),
            ShiftAssignment: shiftAssignment,
            Assignments: {
                create: parsedAssignments.map(a => ({
                    UserID: parseInt(a.userId),
                    MachineID: parseInt(a.machineId)
                }))
            }
        }
    });
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));