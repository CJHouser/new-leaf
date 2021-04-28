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
        let permitted = true;
        if (Array.isArray(perm)) {
          for (let p of perm) {
            if (!this.permissions[p]) permitted = false;
          }
        }
        else {
          permitted = this.permissions[perm];
        }
        return permitted || (adminOverride && this.permissions["ADMINISTRATOR"])
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
