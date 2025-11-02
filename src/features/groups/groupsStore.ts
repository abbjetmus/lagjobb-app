import { defineStore } from 'pinia';
import { pb } from 'src/boot/pocketbase'
import type { GroupsRecord } from 'app/pocketbase-types';
import { Collections } from 'app/pocketbase-types';
import type { WithId } from 'src/models/withIdType';
import { useAuth } from 'src/features/auth/authStore';
import type { GroupsExpand } from 'app/expanded-pocketbase-types';

interface GroupsState {
  myGroups: WithId<GroupsRecord, GroupsExpand>[],
  allGroups: WithId<GroupsRecord>[],
}

export const useGroups = defineStore('groups-module', {
  state() {
    return {
      allGroups: [],
      myGroups: [],
    } as GroupsState;
  },
  actions: {
    async getAllGroups(): Promise<boolean> {
      return pb.collection(Collections.Groups).getFullList().then(res => {
        this.allGroups = res as unknown as WithId<GroupsRecord>[]
        return true
      })
    },
    async getGroupById(id: string): Promise<WithId<GroupsRecord, GroupsExpand> | null> {
      return pb.collection(Collections.Groups).getOne(id, { expand: 'city,createdBy' }).then(res => {
        return res as unknown as WithId<GroupsRecord, GroupsExpand>
      }).catch(e => {
        console.error('Get group by id error:', e)
        return null
      })
    },
    async getMyGroups(): Promise<boolean> {
      const authStore = useAuth();
      if (!authStore.currentUser?.id) return false;

      return pb.collection(Collections.Groups).getFullList({
        filter: `createdBy="${authStore.currentUser.id}"`,
        sort: '-created',
        expand: 'city',
      }).then(res => {
        this.myGroups = res as unknown as WithId<GroupsRecord, GroupsExpand>[]
        return true
      }).catch(e => {
        console.error('Load my groups error:', e)
        return false
      })
    },
    async createGroup(group: Omit<GroupsRecord, 'created' | 'updated'>, image?: File | null): Promise<boolean> {
      const groupToCreate = {
        ...group,
        ...(image && { image }),
      };
      return pb.collection(Collections.Groups).create(groupToCreate).then(() => {
        return true
      }).catch(e => {
        console.error('Create group error:', e)
        return false
      })
    },
    async updateGroup(group: Omit<GroupsRecord, 'created' | 'updated'> | GroupsRecord, image?: File | null): Promise<boolean> {
      const groupToUpdate = {
        ...group,
        ...(image && { image }),
      };
      return pb.collection(Collections.Groups).update(group.id, groupToUpdate).then(() => {
        return true
      }).catch(e => {
        console.error('Update group error:', e)
        return false
      })
    },
    async deleteGroup(id: string): Promise<boolean> {
      return pb.collection(Collections.Groups).delete(id).then(() => {
        return true
      }).catch(e => {
        console.error('Delete group error:', e)
        return false
      })
    }
  }
})
