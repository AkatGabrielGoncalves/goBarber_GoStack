import {
  startOfDay,
  endOfDay,
  setSeconds,
  setMinutes,
  setHours,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvaiableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      req.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedules = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const avaiable = schedules.map((schedule) => {
      const [hour, minute] = schedule.split(':');
      const time = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        schedule,
        time: format(time, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable:
          isAfter(time, new Date()) &&
          !appointments.find(
            (appointment) => format(appointment.date, 'HH:mm') === schedule
          ),
      };
    });

    res.json(avaiable);
  }
}

export default new AvaiableController();
