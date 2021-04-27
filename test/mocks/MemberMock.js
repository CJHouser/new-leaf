class MemberMock {
  constructor(admin=false, manMess=false, readMessHist=false) {
    this.permissions = {
      "ADMINISTRATOR": admin,
      "MANAGE_MESSAGES": manMess,
      "READ_MESSAGE_HISTORY": readMessHist 
    }
  }

  permissionsIn(channel) {
    return {
      has: (perm, adminOverride) => {
        return this.permissions[perm] || (adminOverride && this.permissions["ADMINISTRATOR"])
      }
    }
  }

  setPermissions(admin=false, manMess=false, readMessHist=false) {
    this.permissions = {
      "ADMINISTRATOR": admin,
      "MANAGE_MESSAGES": manMess,
      "READ_MESSAGE_HISTORY": readMessHist 
    }
  }
}

module.exports = MemberMock;
