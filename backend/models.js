import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('Dynamic', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Sync tables if not exist
async function syncModels() {
  await sequelize.sync(); // creates tables if not exist
}

// User model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
}, {
  tableName: 'users',
  timestamps: false,
});

// Contact model
const Contact = sequelize.define('Contact', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  email: { type: DataTypes.STRING },
  mobileNumber: { type: DataTypes.STRING },
  alternateMobileNumber: { type: DataTypes.STRING },
  whatsappNumber: { type: DataTypes.STRING },
  mapUrl: { type: DataTypes.STRING },
}, {
  tableName: 'contacts',
  timestamps: false,
});

User.hasMany(Contact, { foreignKey: 'userId' });
Contact.belongsTo(User, { foreignKey: 'userId' });

// ...existing code...
export { User, Contact, sequelize, syncModels };
