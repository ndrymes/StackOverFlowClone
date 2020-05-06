const bcrypt = require('bcryptjs');
class EncryptionManager {
  getHashed(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  compareHashed(plain, hashed) {
    return bcrypt.compareSync(plain, hashed);
  }
}
const encryptionManager = new EncryptionManager();
module.exports = encryptionManager;
