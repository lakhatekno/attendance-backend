import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Attendance API',
      version: '1.0.0',
      description: 'API documentation for Attendance System Backend',
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
          },
        },
        Shift: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            shift_start: { type: 'string', format: 'time' },
            shift_end: { type: 'string', format: 'time' },
            cross_day: { type: 'boolean' },
            active: { type: 'boolean' },
          },
        },
        ShiftAssignment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            shift_id: { type: 'integer' },
            user_id: { type: 'integer' },
            shift_start: { type: 'string', format: 'date-time' },
            shift_end: { type: 'string', format: 'date-time' },
          },
        },
        AttendanceLog: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            shift_assignment_id: { type: 'integer' },
            record: { type: 'string', format: 'date-time' },
            category: { type: 'string' },
            status: { type: 'string' },
          },
        },
        DailySummary: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            shift_assignment_id: { type: 'integer' },
            checkin_time: { type: 'string', format: 'date-time' },
            checkout_time: { type: 'string', format: 'date-time' },
            checkin_status: { type: 'string' },
            checkout_status: { type: 'string' },
            summary_status: { type: 'string' },
            work_duration: { type: 'integer' },
            late_duration: { type: 'integer' },
            overtime_duration: { type: 'integer' },
            early_leave_duration: { type: 'integer' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // 👈 look for annotations here
};

export const swaggerSpec = swaggerJSDoc(options);

