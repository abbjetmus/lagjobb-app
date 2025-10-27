/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Cities = "cities",
	Counties = "counties",
	Groups = "groups",
	JobCategories = "jobCategories",
	JobSubcategories = "jobSubcategories",
	Jobs = "jobs",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type CitiesRecord = {
	county: RecordIdString
	created?: IsoDateString
	id: string
	latitude: number
	longitude: number
	name: string
	title: string
	updated?: IsoDateString
}

export type CountiesRecord = {
	color: string
	created?: IsoDateString
	id: string
	name: string
	title: string
	updated?: IsoDateString
}

export enum GroupsGroupTypeOptions {
	"Lag" = "Lag",
	"Klass" = "Klass",
	"Förening" = "Förening",
	"Organisation" = "Organisation",
}
export type GroupsRecord = {
	created?: IsoDateString
	createdBy?: RecordIdString
	description?: string
	groupType?: GroupsGroupTypeOptions
	id: string
	jobs?: RecordIdString
	name: string
	updated?: IsoDateString
	verified?: boolean
}

export type JobCategoriesRecord = {
	color: string
	created?: IsoDateString
	id: string
	name: string
	title: string
	updated?: IsoDateString
}

export type JobSubcategoriesRecord = {
	category: RecordIdString
	created?: IsoDateString
	id: string
	name: string
	title: string
	updated?: IsoDateString
}

export enum JobsStatusOptions {
	"Granskning" = "Granskning",
	"Godkänd" = "Godkänd",
	"Publicerad" = "Publicerad",
	"Genomförd" = "Genomförd",
}
export type JobsRecord = {
	assignedGroup?: RecordIdString
	city: RecordIdString
	contactHours?: string
	created?: IsoDateString
	createdBy?: RecordIdString
	description?: string
	desiredAt?: IsoDateString
	desiredNumberOfPeople?: number
	estimatedHours?: number
	hidePhone?: boolean
	id: string
	images?: string[]
	jobSubcategories?: RecordIdString[]
	latitude?: number
	longitude?: number
	price?: number
	status?: JobsStatusOptions
	street: string
	title?: string
	updated?: IsoDateString
	zipcode?: string
}

export enum UsersUserAccountTypeOptions {
	"Uppdragsgivare" = "Uppdragsgivare",
	"Uppdragsutförare" = "Uppdragsutförare",
}
export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name: string
	password: string
	phone?: string
	tokenKey: string
	updated?: IsoDateString
	userAccountType: UsersUserAccountTypeOptions
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type CitiesResponse<Texpand = unknown> = Required<CitiesRecord> & BaseSystemFields<Texpand>
export type CountiesResponse<Texpand = unknown> = Required<CountiesRecord> & BaseSystemFields<Texpand>
export type GroupsResponse<Texpand = unknown> = Required<GroupsRecord> & BaseSystemFields<Texpand>
export type JobCategoriesResponse<Texpand = unknown> = Required<JobCategoriesRecord> & BaseSystemFields<Texpand>
export type JobSubcategoriesResponse<Texpand = unknown> = Required<JobSubcategoriesRecord> & BaseSystemFields<Texpand>
export type JobsResponse<Texpand = unknown> = Required<JobsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	cities: CitiesRecord
	counties: CountiesRecord
	groups: GroupsRecord
	jobCategories: JobCategoriesRecord
	jobSubcategories: JobSubcategoriesRecord
	jobs: JobsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	cities: CitiesResponse
	counties: CountiesResponse
	groups: GroupsResponse
	jobCategories: JobCategoriesResponse
	jobSubcategories: JobSubcategoriesResponse
	jobs: JobsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'cities'): RecordService<CitiesResponse>
	collection(idOrName: 'counties'): RecordService<CountiesResponse>
	collection(idOrName: 'groups'): RecordService<GroupsResponse>
	collection(idOrName: 'jobCategories'): RecordService<JobCategoriesResponse>
	collection(idOrName: 'jobSubcategories'): RecordService<JobSubcategoriesResponse>
	collection(idOrName: 'jobs'): RecordService<JobsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
