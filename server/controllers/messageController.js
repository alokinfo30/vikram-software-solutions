// server/controllers/messageController.js
import Message from '../models/Message.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiver, content, attachments } = req.body;
    const sender = req.user._id;

    if (!receiver || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver and content are required'
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      content,
      attachments: attachments || []
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'firstName lastName email role profilePicture')
      .populate('receiver', 'firstName lastName email role profilePicture');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
};

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.getConversation(currentUserId, otherUserId);

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages'
    });
  }
};

// @desc    Get list of conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
          isDeleted: false
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1, role: 1, profilePicture: 1 } }
          ]
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          user: 1,
          lastMessage: 1,
          unread: {
            $and: [
              { $eq: ['$lastMessage.receiver', userId] },
              { $eq: ['$lastMessage.read', false] }
            ]
          }
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations'
    });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.messageId,
      receiver: req.user._id,
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.markAsRead();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating message'
    });
  }
};

// @desc    Get unread message count for current user
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user._id);

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
};

// @desc    Delete a message (soft delete)
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.messageId,
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      isDeleted: false
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message'
    });
  }
};
