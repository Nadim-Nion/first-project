import config from '../config';
import { UserRole } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'super-admin@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: UserRole.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // When database is connected, we'll check there is any user who is super admin

  const isSuperAdminExists = await User.findOne({ role: UserRole.superAdmin });

  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
