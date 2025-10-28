import { defineStore } from 'pinia';
import {
  pb,
} from 'src/boot/pocketbase';
import type {
  UsersRecord,
} from 'app/pocketbase-types';
import {
  Collections
} from 'app/pocketbase-types'
import type { AuthModel } from 'pocketbase';
import type { WithId } from 'src/models/withIdType';

interface AuthState {
  token: null | string
  expiration: null | string
  currentUser: null | WithId<UsersRecord>
  authModel: null | AuthModel
}

export const useAuth = defineStore('auth-module', {
  state() {
    return {
      token: null,
      expiration: null,
      currentUser: null,
      authModel: null,
    } as AuthState
  },
  getters: {
    isAuthenticated(): boolean {
      return pb.authStore.isValid
    }
  },
  actions: {
    async createUser(user: UsersRecord): Promise<boolean> {
      const data = {
        email: user.email,
        emailVisibility: true,
        password: user.password,
        passwordConfirm: user.password,
        name: user.name,
      } as unknown as UsersRecord

      return pb.collection(Collections.Users).create(data).then(() => {
        return true
      }).catch(e => {
        console.error(e)
        return false
      });
    },
    async updateUser(user: UsersRecord): Promise<boolean> {
      const data = {
        name: user.name,
      }

      return pb.collection(Collections.Users).update(user.id, data).then(() => {
        return true
      }).catch(e => {
        console.error(e)
        return false
      });
    },
    async signUp(user: UsersRecord): Promise<boolean> {
      try {
        const data = {
          email: user.email,
          emailVisibility: true,
          password: user.password,
          passwordConfirm: user.password,
          name: user.name,
        } as unknown as UsersRecord

        return pb.collection(Collections.Users).create(data).then(() => {
          return this.signIn(user.email, user.password);
        });
      } catch (error) {
        console.error("Sign-up error:", error);
        return false;
      }
    },
    async signIn(emailUsername: string, password: string): Promise<boolean> {
      return pb.collection(Collections.Users).authWithPassword(emailUsername, password).then(() => {
        return true
      })
        .catch((error) => {
          console.error("Sign-in error:", error);
          return false;
        });
    },
    async signInWithPhone(phoneNumber: string, idToken: string): Promise<boolean> {
      try {
        // Find or create user with this phone number
        const response = await pb.send('/api/auth/phone/sign-in', {
          method: 'POST',
          body: {
            phone: phoneNumber,
            idToken: idToken // Send the Firebase ID token for verification
          }
        });

        if (response) {
          pb.authStore.save(response.token, response.user);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Phone sign-in error:", error);
        return false;
      }
    },
    async forgotPassword(email: string): Promise<boolean> {
      return pb.collection(Collections.Users).requestPasswordReset(email).then(() => {
        return true;
      }).catch((error) => {
        console.error("Forgot password error:", error);
        return false;
      })
    },
    async resetPassword(resetToken: string, password: string): Promise<boolean> {
      return pb.collection(Collections.Users).confirmPasswordReset(resetToken, password, password).then(() => {
        return true;
      }).catch((error) => {
        console.error("Reset password error:", error);
        return false;
      })
    },
    async getOnlyUser(userId: string): Promise<UsersRecord | null> {
      return pb.collection(Collections.Users).getOne(userId).then((res) => {
        return res as unknown as WithId<UsersRecord>
      }).catch((error) => {
        console.error("Error getting user:", error);
        return null;
      })
    },
    async getUser(): Promise<boolean> {
      try {
        const userId = this.authModel?.id;
        const user = await pb.collection(Collections.Users).getOne(userId!, {
        });
        this.currentUser = user as unknown as WithId<UsersRecord>
        return true
      } catch (error) {
        console.error("Error getting user:", error);
        return false;
      }
    },
    signOut() {
      pb.authStore.clear();
      this.currentUser = null
      this.token = null
      this.authModel = null
    },
    async updateUserImage(image: File | []): Promise<boolean> {
      return pb.collection(Collections.Users).update(this.authModel!.id, {
        'avatar': image,
      }).then((res) => {
        this.currentUser!.avatar = (res as unknown as UsersRecord).avatar ?? ''
        return true
      }).catch(e => {
        console.error(e)
        return false
      })
    },
    async updateUserName(name: string): Promise<boolean> {
      return pb.collection(Collections.Users).update(this.authModel!.id, {
        name: name
      }).then(() => {
        this.currentUser!.name = name
        return true
      }).catch((error) => {
        console.error("Error updating user name:", error);
        return false;
      })
    },
    async updateUserEmail(email: string): Promise<boolean> {
      return pb.collection(Collections.Users).update(this.authModel!.id, {
        email: email
      }).then(() => {
        this.currentUser!.email = email
        return true
      }).catch((error) => {
        console.error("Error updating user email:", error);
        return false;
      })
    },
    async updateUserPhone(phone: string): Promise<boolean> {
      return pb.collection(Collections.Users).update(this.authModel!.id, {
        phone: phone
      }).then(() => {
        this.currentUser!.phone = phone
        return true
      }).catch((error) => {
        console.error("Error updating user phone:", error);
        return false;
      })
    },
    async updateUserPassword(data: { oldPassword: string, password: string, passwordConfirm: string }): Promise<boolean> {
      return pb.collection(Collections.Users).update(this.authModel!.id, {
        oldPassword: data.oldPassword,
        password: data.password,
        passwordConfirm: data.passwordConfirm
      }).then(() => {
        return true
      }).catch((error) => {
        console.error("Error updating user password:", error);
        return false;
      })
    },
    async deleteUser(): Promise<boolean> {
      return pb.collection(Collections.Users).delete(this.authModel!.id).then(() => {
        return true;
      }).catch((error) => {
        console.error("Error deleting user:", error);
        return false;
      })
    }
  }
})
