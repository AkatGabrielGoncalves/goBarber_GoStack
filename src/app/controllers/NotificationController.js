import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true }, // GET PROVIDER
    });

    if (!provider) {
      return res.status(401).json({ error: 'Unauthorized Access' }); // CHECK IF PROVIDERS EXISTS
    }

    const notifications = await Notification.find({
      user: provider.id,
    })
      .sort('createdAt')
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
