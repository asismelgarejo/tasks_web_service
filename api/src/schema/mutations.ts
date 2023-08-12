import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import UserPayload from "./types/payload-user";
import UserInput from "./types/input-user";
import { ContextCustom } from "../models";
import AuthInput from "./types/input-auth";
import TaskPayload from "./types/payload-task";
import TaskInput, { TaskUpdateInput } from "./types/input-task";
import ApproachPayload from "./types/payload-approach";
import ApproachInput from "./types/input-approach";
import ApproachVoteInput from "./types/approach-vote-input";
import UserDeletePayload from "./types/UserDeletePayload";

const MutationType = new GraphQLObjectType<any, ContextCustom>({
    name: "Mutation",
    fields: () => ({
        userCreate: {
            type: new GraphQLNonNull(UserPayload),
            args: {
                input: { type: new GraphQLNonNull(UserInput) },
            },
            async resolve(source, { input }, { mutators }) {
                return mutators.pgApi.userCreate({ input });
            },
        },
        userLogin: {
            type: new GraphQLNonNull(UserPayload),
            args: {
                input: {
                    type: new GraphQLNonNull(AuthInput),
                },
            },
            resolve(_, { input }, { mutators }) {
                return mutators.pgApi.userLogin({ input });
            },
        },
        taskCreate: {
            type: TaskPayload,
            args: {
                input: {
                    type: new GraphQLNonNull(TaskInput),
                },
            },
            resolve(_, { input }, { mutators, currentUser }) {
                return mutators.pgApi.taskCreate({ input, currentUser });
            },
        },
        taskUpdate: {
            type: TaskPayload,
            args: {
                input: {
                    type: new GraphQLNonNull(TaskUpdateInput),
                },
                taskId: {
                    type: new GraphQLNonNull(GraphQLString),
                },
            },
            resolve(_, { input, taskId }, { mutators, currentUser }) {
                return mutators.pgApi.taskUpdate({ input, currentUser, taskId: taskId });
            },
        },
        approachCreate: {
            type: ApproachPayload,
            args: {
                taskId: {
                    type: new GraphQLNonNull(GraphQLID),
                },
                input: {
                    type: new GraphQLNonNull(ApproachInput),
                },
            },
            async resolve(_, { taskId, input }, { mutators, currentUser }) {
                const response = await mutators.pgApi.approachCreate({ currentUser, input, taskId });
                if (!response.errors.length && response.approach) {
                    await mutators.mongoApi.approachDetailCreate(response.approach.id, input.detailList);
                }
                return response;
            },
        },
        approachVote: {
            type: ApproachPayload,
            args: {
                approachId: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                input: {
                    type: new GraphQLNonNull(ApproachVoteInput),
                },
            },
            resolve(_, { input, approachId }, { mutators }) {
                return mutators.pgApi.approachVote(+approachId, input.up);
            },
        },
        userDelete: {
            type: UserDeletePayload,
            resolve(_, {}, { mutators, currentUser }) {
                return mutators.pgApi.userDelete(currentUser);
            },
        },
    }),
});

export default MutationType;
