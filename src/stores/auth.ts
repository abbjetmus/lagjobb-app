import { defineStore } from 'pinia';
import { pb } from 'src/boot/pocketbase';
import type { User } from 'src/models/User';

interface AuthState {
  authModel: Record<string, unknown> | null;
  user: User | null;
}

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    authModel: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.authModel && pb.authStore.isValid,
    currentUser: (state) => state.user,
  },

  actions: {
    async signUp(email: string, password: string, name: string) {
      try {
        const user = await pb.collection('users').create({
          email,
          password,
          passwordConfirm: password,
          name,
        });
        await pb.collection('users').requestVerification(email);
        return user;
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    },

    async signIn(email: string, password: string) {
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        this.authModel = authData.record;
        await this.getUser();
        return authData;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    signOut() {
      pb.authStore.clear();
      this.authModel = null;
      this.user = null;
    },

    async getUser() {
      if (pb.authStore.model?.id) {
        try {
          this.user = await pb.collection('users').getOne(pb.authStore.model.id);
        } catch (error) {
          console.error('Get user error:', error);
        }
      }
    },

    async resetPassword(email: string) {
      try {
        await pb.collection('users').requestPasswordReset(email);
      } catch (error) {
        console.error('Reset password error:', error);
        throw error;
      }
    },

    async updateUser(data: Partial<User>) {
      if (!this.user?.id) return;

      try {
        this.user = await pb.collection('users').update(this.user.id, data);
      } catch (error) {
        console.error('Update user error:', error);
        throw error;
      }
    },
  },
});

