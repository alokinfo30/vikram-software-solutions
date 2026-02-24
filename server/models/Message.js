// server/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  attachments: [{
    filename: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Mark as read
messageSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = Date.now();
  return this.save();
};

// Get unread count for a user
messageSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    receiver: userId,
    read: false,
    isDeleted: false
  });
};

// Get conversation between two users
messageSchema.statics.getConversation = async function(user1Id, user2Id) {
  return await this.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id }
    ],
    isDeleted: false
  })
  .populate('sender', 'firstName lastName email role profilePicture')
  .populate('receiver', 'firstName lastName email role profilePicture')
  .sort('createdAt');
};

// Indexes
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ receiver: 1, read: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;