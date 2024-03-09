import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class HealthzResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): HealthzResponse;

  getMessage(): string;
  setMessage(value: string): HealthzResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthzResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HealthzResponse): HealthzResponse.AsObject;
  static serializeBinaryToWriter(message: HealthzResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HealthzResponse;
  static deserializeBinaryFromReader(message: HealthzResponse, reader: jspb.BinaryReader): HealthzResponse;
}

export namespace HealthzResponse {
  export type AsObject = {
    status: string,
    message: string,
  }
}

export class HealthzRequest extends jspb.Message {
  getComponentname(): string;
  setComponentname(value: string): HealthzRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthzRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HealthzRequest): HealthzRequest.AsObject;
  static serializeBinaryToWriter(message: HealthzRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HealthzRequest;
  static deserializeBinaryFromReader(message: HealthzRequest, reader: jspb.BinaryReader): HealthzRequest;
}

export namespace HealthzRequest {
  export type AsObject = {
    componentname: string,
  }
}

export class ErrRequest extends jspb.Message {
  getErrormessage(): string;
  setErrormessage(value: string): ErrRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ErrRequest): ErrRequest.AsObject;
  static serializeBinaryToWriter(message: ErrRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrRequest;
  static deserializeBinaryFromReader(message: ErrRequest, reader: jspb.BinaryReader): ErrRequest;
}

export namespace ErrRequest {
  export type AsObject = {
    errormessage: string,
  }
}

export class ErrResponse extends jspb.Message {
  getResultmessage(): string;
  setResultmessage(value: string): ErrResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ErrResponse): ErrResponse.AsObject;
  static serializeBinaryToWriter(message: ErrResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrResponse;
  static deserializeBinaryFromReader(message: ErrResponse, reader: jspb.BinaryReader): ErrResponse;
}

export namespace ErrResponse {
  export type AsObject = {
    resultmessage: string,
  }
}

export class User extends jspb.Message {
  getId(): string;
  setId(value: string): User;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): User;
  hasCreatedat(): boolean;
  clearCreatedat(): User;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): User;
  hasUpdatedat(): boolean;
  clearUpdatedat(): User;

  getName(): string;
  setName(value: string): User;

  getApikey(): string;
  setApikey(value: string): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    name: string,
    apikey: string,
  }
}

export class CreateUserRequest extends jspb.Message {
  getId(): string;
  setId(value: string): CreateUserRequest;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): CreateUserRequest;
  hasCreatedat(): boolean;
  clearCreatedat(): CreateUserRequest;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): CreateUserRequest;
  hasUpdatedat(): boolean;
  clearUpdatedat(): CreateUserRequest;

  getName(): string;
  setName(value: string): CreateUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserRequest): CreateUserRequest.AsObject;
  static serializeBinaryToWriter(message: CreateUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserRequest;
  static deserializeBinaryFromReader(message: CreateUserRequest, reader: jspb.BinaryReader): CreateUserRequest;
}

export namespace CreateUserRequest {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    name: string,
  }
}

export class GetUserRequest extends jspb.Message {
  getApikey(): string;
  setApikey(value: string): GetUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserRequest): GetUserRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserRequest;
  static deserializeBinaryFromReader(message: GetUserRequest, reader: jspb.BinaryReader): GetUserRequest;
}

export namespace GetUserRequest {
  export type AsObject = {
    apikey: string,
  }
}

export class Feed extends jspb.Message {
  getId(): string;
  setId(value: string): Feed;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Feed;
  hasCreatedat(): boolean;
  clearCreatedat(): Feed;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): Feed;
  hasUpdatedat(): boolean;
  clearUpdatedat(): Feed;

  getName(): string;
  setName(value: string): Feed;

  getUrl(): string;
  setUrl(value: string): Feed;

  getUserid(): string;
  setUserid(value: string): Feed;

  getLastfetchedat(): string;
  setLastfetchedat(value: string): Feed;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Feed.AsObject;
  static toObject(includeInstance: boolean, msg: Feed): Feed.AsObject;
  static serializeBinaryToWriter(message: Feed, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Feed;
  static deserializeBinaryFromReader(message: Feed, reader: jspb.BinaryReader): Feed;
}

export namespace Feed {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    name: string,
    url: string,
    userid: string,
    lastfetchedat: string,
  }
}

export class CreateFeedRequest extends jspb.Message {
  getId(): string;
  setId(value: string): CreateFeedRequest;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): CreateFeedRequest;
  hasCreatedat(): boolean;
  clearCreatedat(): CreateFeedRequest;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): CreateFeedRequest;
  hasUpdatedat(): boolean;
  clearUpdatedat(): CreateFeedRequest;

  getName(): string;
  setName(value: string): CreateFeedRequest;

  getUrl(): string;
  setUrl(value: string): CreateFeedRequest;

  getUserid(): string;
  setUserid(value: string): CreateFeedRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFeedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFeedRequest): CreateFeedRequest.AsObject;
  static serializeBinaryToWriter(message: CreateFeedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFeedRequest;
  static deserializeBinaryFromReader(message: CreateFeedRequest, reader: jspb.BinaryReader): CreateFeedRequest;
}

export namespace CreateFeedRequest {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    name: string,
    url: string,
    userid: string,
  }
}

export class GetFeedsRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetFeedsRequest;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): GetFeedsRequest;
  hasCreatedat(): boolean;
  clearCreatedat(): GetFeedsRequest;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): GetFeedsRequest;
  hasUpdatedat(): boolean;
  clearUpdatedat(): GetFeedsRequest;

  getName(): string;
  setName(value: string): GetFeedsRequest;

  getUrl(): string;
  setUrl(value: string): GetFeedsRequest;

  getUserid(): string;
  setUserid(value: string): GetFeedsRequest;

  getLastfetchedat(): string;
  setLastfetchedat(value: string): GetFeedsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeedsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeedsRequest): GetFeedsRequest.AsObject;
  static serializeBinaryToWriter(message: GetFeedsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeedsRequest;
  static deserializeBinaryFromReader(message: GetFeedsRequest, reader: jspb.BinaryReader): GetFeedsRequest;
}

export namespace GetFeedsRequest {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    name: string,
    url: string,
    userid: string,
    lastfetchedat: string,
  }
}

export class CreateFeedFollowRequest extends jspb.Message {
  getId(): string;
  setId(value: string): CreateFeedFollowRequest;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): CreateFeedFollowRequest;
  hasCreatedat(): boolean;
  clearCreatedat(): CreateFeedFollowRequest;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): CreateFeedFollowRequest;
  hasUpdatedat(): boolean;
  clearUpdatedat(): CreateFeedFollowRequest;

  getUserid(): string;
  setUserid(value: string): CreateFeedFollowRequest;

  getFeedid(): string;
  setFeedid(value: string): CreateFeedFollowRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFeedFollowRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFeedFollowRequest): CreateFeedFollowRequest.AsObject;
  static serializeBinaryToWriter(message: CreateFeedFollowRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFeedFollowRequest;
  static deserializeBinaryFromReader(message: CreateFeedFollowRequest, reader: jspb.BinaryReader): CreateFeedFollowRequest;
}

export namespace CreateFeedFollowRequest {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    userid: string,
    feedid: string,
  }
}

export class GetFeedFollowsRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): GetFeedFollowsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeedFollowsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeedFollowsRequest): GetFeedFollowsRequest.AsObject;
  static serializeBinaryToWriter(message: GetFeedFollowsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeedFollowsRequest;
  static deserializeBinaryFromReader(message: GetFeedFollowsRequest, reader: jspb.BinaryReader): GetFeedFollowsRequest;
}

export namespace GetFeedFollowsRequest {
  export type AsObject = {
    userid: string,
  }
}

export class DeleteFeedFollowsRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteFeedFollowsRequest;

  getUserid(): string;
  setUserid(value: string): DeleteFeedFollowsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFeedFollowsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFeedFollowsRequest): DeleteFeedFollowsRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteFeedFollowsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFeedFollowsRequest;
  static deserializeBinaryFromReader(message: DeleteFeedFollowsRequest, reader: jspb.BinaryReader): DeleteFeedFollowsRequest;
}

export namespace DeleteFeedFollowsRequest {
  export type AsObject = {
    id: string,
    userid: string,
  }
}

export class FeedFollow extends jspb.Message {
  getId(): string;
  setId(value: string): FeedFollow;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): FeedFollow;
  hasCreatedat(): boolean;
  clearCreatedat(): FeedFollow;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): FeedFollow;
  hasUpdatedat(): boolean;
  clearUpdatedat(): FeedFollow;

  getUserid(): string;
  setUserid(value: string): FeedFollow;

  getFeedid(): string;
  setFeedid(value: string): FeedFollow;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeedFollow.AsObject;
  static toObject(includeInstance: boolean, msg: FeedFollow): FeedFollow.AsObject;
  static serializeBinaryToWriter(message: FeedFollow, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeedFollow;
  static deserializeBinaryFromReader(message: FeedFollow, reader: jspb.BinaryReader): FeedFollow;
}

export namespace FeedFollow {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    userid: string,
    feedid: string,
  }
}

export class GetPostsForUserRequest extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): GetPostsForUserRequest;

  getLimit(): string;
  setLimit(value: string): GetPostsForUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPostsForUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPostsForUserRequest): GetPostsForUserRequest.AsObject;
  static serializeBinaryToWriter(message: GetPostsForUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPostsForUserRequest;
  static deserializeBinaryFromReader(message: GetPostsForUserRequest, reader: jspb.BinaryReader): GetPostsForUserRequest;
}

export namespace GetPostsForUserRequest {
  export type AsObject = {
    userid: string,
    limit: string,
  }
}

export class Post extends jspb.Message {
  getId(): string;
  setId(value: string): Post;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): Post;
  hasCreatedat(): boolean;
  clearCreatedat(): Post;

  getUpdatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedat(value?: google_protobuf_timestamp_pb.Timestamp): Post;
  hasUpdatedat(): boolean;
  clearUpdatedat(): Post;

  getTitle(): string;
  setTitle(value: string): Post;

  getDescription(): string;
  setDescription(value: string): Post;

  getPublishedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setPublishedat(value?: google_protobuf_timestamp_pb.Timestamp): Post;
  hasPublishedat(): boolean;
  clearPublishedat(): Post;

  getUrl(): string;
  setUrl(value: string): Post;

  getFeedid(): string;
  setFeedid(value: string): Post;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Post.AsObject;
  static toObject(includeInstance: boolean, msg: Post): Post.AsObject;
  static serializeBinaryToWriter(message: Post, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Post;
  static deserializeBinaryFromReader(message: Post, reader: jspb.BinaryReader): Post;
}

export namespace Post {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    title: string,
    description: string,
    publishedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    url: string,
    feedid: string,
  }
}

export class ViewRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ViewRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ViewRequest): ViewRequest.AsObject;
  static serializeBinaryToWriter(message: ViewRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ViewRequest;
  static deserializeBinaryFromReader(message: ViewRequest, reader: jspb.BinaryReader): ViewRequest;
}

export namespace ViewRequest {
  export type AsObject = {
  }
}

export class ViewResponse extends jspb.Message {
  getHtml(): string;
  setHtml(value: string): ViewResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ViewResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ViewResponse): ViewResponse.AsObject;
  static serializeBinaryToWriter(message: ViewResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ViewResponse;
  static deserializeBinaryFromReader(message: ViewResponse, reader: jspb.BinaryReader): ViewResponse;
}

export namespace ViewResponse {
  export type AsObject = {
    html: string,
  }
}

export class ReadinessRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadinessRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReadinessRequest): ReadinessRequest.AsObject;
  static serializeBinaryToWriter(message: ReadinessRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadinessRequest;
  static deserializeBinaryFromReader(message: ReadinessRequest, reader: jspb.BinaryReader): ReadinessRequest;
}

export namespace ReadinessRequest {
  export type AsObject = {
  }
}

export class ReadinessResponse extends jspb.Message {
  getIsready(): boolean;
  setIsready(value: boolean): ReadinessResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadinessResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ReadinessResponse): ReadinessResponse.AsObject;
  static serializeBinaryToWriter(message: ReadinessResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadinessResponse;
  static deserializeBinaryFromReader(message: ReadinessResponse, reader: jspb.BinaryReader): ReadinessResponse;
}

export namespace ReadinessResponse {
  export type AsObject = {
    isready: boolean,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

