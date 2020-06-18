import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';

class ScheduleController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const user = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const schedule = await Appointment.findAll({
      where: {
        provider_id: user.id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      attributes: ['id', 'date', 'createdAt', 'updatedAt'],
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(schedule);
  }
}

export default new ScheduleController();
