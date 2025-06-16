// To parse this data:
//
//   import { Convert, RuntimeCall } from "./file";
//
//   const runtimeCall = Convert.toRuntimeCall(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * This enum is generated from the underlying Runtime, the variants correspond to call
 * messages from the relevant modules
 *
 * Module call message.
 */
export interface RuntimeCall {
    accounts?:            CallMessage;
    uniqueness?:          null;
    bank?:                CallMessage2;
    sequencer_registry?:  CallMessage3;
    attester_incentives?: CallMessage4Class | CallMessage4Enum;
    prover_incentives?:   CallMessage5Class | CallMessage5Enum;
    example_module?:      CallMessage6;
    reddit_module?:       CallMessage7;
    chain_state?:         null;
    blob_storage?:        null;
    paymaster?:           CallMessage8;
}

/**
 * Represents the available call messages for interacting with the sov-accounts module.
 *
 * Inserts a new credential id for the corresponding Account.
 */
export interface CallMessage {
    insert_credential_id: string;
}

/**
 * Register an attester, the parameter is the bond amount
 *
 * Register a challenger, the parameter is the bond amount
 *
 * Increases the balance of the attester.
 */
export interface CallMessage4Class {
    register_attester?:   number;
    register_challenger?: number;
    deposit_attester?:    number;
}

/**
 * Start the first phase of the two-phase exit process
 *
 * Finish the two phase exit
 *
 * Exit a challenger
 */
export enum CallMessage4Enum {
    BeginExitAttester = "begin_exit_attester",
    ExitAttester = "exit_attester",
    ExitChallenger = "exit_challenger",
}

/**
 * This enumeration represents the available call messages for interacting with the sov-bank
 * module.
 *
 * Creates a new token with the specified name and initial balance.
 *
 * Transfers a specified amount of tokens to the specified address.
 *
 * Burns a specified amount of tokens.
 *
 * Mints a specified amount of tokens.
 *
 * Freezes a token so that the supply is frozen
 */
export interface CallMessage2 {
    create_token?: CreateToken;
    transfer?:     Transfer;
    burn?:         Burn;
    mint?:         Mint;
    freeze?:       Freeze;
}

export interface Burn {
    /**
     * The amount of tokens to burn.
     */
    coins: Coins;
    [property: string]: any;
}

/**
 * The amount of tokens to transfer.
 *
 * Structure that stores information specifying a given `amount` (type [`Amount`]) of coins
 * stored at a `token_id` (type [`crate::TokenId`]).
 *
 * The amount of tokens to burn.
 *
 * The amount of tokens to mint.
 */
export interface Coins {
    /**
     * The number of tokens
     */
    amount: number;
    /**
     * The ID of the token
     */
    token_id: string;
    [property: string]: any;
}

export interface CreateToken {
    /**
     * Admins list.
     */
    admins: string[];
    /**
     * The initial balance of the new token.
     */
    initial_balance: number;
    /**
     * The address of the account that the new tokens are minted to.
     */
    mint_to_address: string;
    /**
     * The supply cap of the new token, if any.
     */
    supply_cap?: number | null;
    /**
     * The number of decimal places this token's amounts will have.
     */
    token_decimals?: number | null;
    /**
     * The name of the new token.
     */
    token_name: string;
    [property: string]: any;
}

export interface Freeze {
    /**
     * Address of the token to be frozen
     */
    token_id: string;
    [property: string]: any;
}

export interface Mint {
    /**
     * The amount of tokens to mint.
     */
    coins: Coins;
    /**
     * Address to mint tokens to
     */
    mint_to_address: string;
    [property: string]: any;
}

export interface Transfer {
    /**
     * The amount of tokens to transfer.
     */
    coins: Coins;
    /**
     * The address to which the tokens will be transferred.
     */
    to: string;
    [property: string]: any;
}

/**
 * This enumeration represents the available call messages for interacting with the
 * `ExampleModule` module. The `derive` for [`schemars::JsonSchema`] is a requirement of
 * [`sov_modules_api::ModuleCallJsonSchema`].
 */
export interface CallMessage6 {
    set_value: number;
}

export interface UpdatePolicy {
    payer:  string;
    update: CallMessage8;
    [property: string]: any;
}

/**
 * Call messages for interacting with the `Paymaster` module.
 *
 * ## Note: These call messages are highly unusual in that they have different effects based
 * on the address of the sequencer who places them on chain. See the docs on individual
 * variants for more information.
 *
 * Register a new payer with the given policy. If the sequencer who places this message on
 * chain is present in the list of `authorized_sequencers` to use the payer, the payer
 * address for that sequencer is set to the address of the newly registered payer.
 *
 * Set the payer address for the sequencer to the given address. This call message is highly
 * unusual in that it executes regardless of the sender address on the rollup. Sequencers
 * who do not wish to update their payer address should not sequence transactions containing
 * this callmessage.
 *
 * Update the policy for a given payer. If the sequencer who places this message on chain is
 * present in the list of `authorized_sequencers` to use the payer after the update, the
 * payer address for that sequencer is set to the address of the newly registered paymaster.
 */
export interface CallMessage8 {
    register_paymaster?:      RegisterPaymaster;
    set_payer_for_sequencer?: SetPayerForSequencer;
    update_policy?:           UpdatePolicy;
}

export interface RegisterPaymaster {
    policy: PaymasterPolicyInitializer;
    [property: string]: any;
}

/**
 * An initial policy for a paymaster. This includes... - A set of sequencers that can use
 * the paymaster - A set of users authorized to update this policy - A default policy for
 * accepting/rejecting gas requests - Specific policies for accepting/rejecting gas requests
 * from particular users
 */
export interface PaymasterPolicyInitializer {
    /**
     * Sequencers who are authorized to use this payer.
     */
    authorized_sequencers: AuthorizedSequencersClass | AuthorizedSequencersEnum;
    /**
     * Users who are authorized to update this policy.
     */
    authorized_updaters: string[];
    /**
     * Default payee policy for users that are not in the balances map.
     */
    default_payee_policy: PayeePolicyClass | PayeePolicyEnum;
    /**
     * A mapping from user address to the policy for that user.
     */
    payees: Array<Array<PayeePolicyClass | string>>;
    [property: string]: any;
}

/**
 * Only the specified sequencers may use this payer.
 */
export interface AuthorizedSequencersClass {
    some: string[];
}

/**
 * All sequencers are authorized to use this payer (according to its policy).
 */
export enum AuthorizedSequencersEnum {
    All = "all",
}

/**
 * The paymaster pays the fees for a particular sender when the policy allows it... - If the
 * policy specifies a `max_fee`, the transaction's max fee must be less than or equal to
 * that value - if the policy specifies a `max_gas_price`, the current gas price must be
 * less than or equal to that value - If the policy specifies a gas limit, the transaction
 * must also specify a limit *and* that limit must be less than or equal to `gas_limit`.
 *
 * - If the policy specifies a transaction_limit, the policy can only cover that many
 * transactions, after which it will expire and be replaced with a Deny policy
 *
 * In all other cases, the sender pays their own fees.
 */
export interface PayeePolicyClass {
    allow: Allow;
}

export interface Allow {
    gas_limit?:         number[] | null;
    max_fee?:           number | null;
    max_gas_price?:     number[] | null;
    transaction_limit?: number | null;
    [property: string]: any;
}

/**
 * The payer does not pay fees for any transaction using this policy.
 */
export enum PayeePolicyEnum {
    Deny = "deny",
}

export interface SetPayerForSequencer {
    payer: string;
    [property: string]: any;
}

/**
 * Add a new prover as a bonded prover.
 *
 * Increases the balance of the prover, transferring the funds from the prover account to
 * the rollup.
 */
export interface CallMessage5Class {
    register?: number;
    deposit?:  number;
}

/**
 * Unbonds the prover.
 */
export enum CallMessage5Enum {
    Exit = "exit",
}

export interface CallMessage7 {
    create_user?:       CreateUser;
    create_sub_reddit?: CreateSubReddit;
    create_post?:       CreatePost;
}

export interface CreatePost {
    content:    string;
    flair:      string;
    subaddress: string;
    title:      string;
    [property: string]: any;
}

export interface CreateSubReddit {
    description:  string;
    subname:      string;
    user_address: string;
    [property: string]: any;
}

export interface CreateUser {
    username: string;
    [property: string]: any;
}

/**
 * This enumeration represents the available call messages for interacting with the
 * `sov-sequencer-registry` module.
 *
 * Add a new sequencer to the sequencer registry.
 *
 * Increases the balance of the sequencer, transferring the funds from the sequencer account
 * to the rollup.
 *
 * Initiate a withdrawal of a sequencer's balance.
 *
 * Withdraw a sequencer's balance after waiting for the withdrawal period.
 */
export interface CallMessage3 {
    register?:            Register;
    deposit?:             Deposit;
    initiate_withdrawal?: InitiateWithdrawal;
    withdraw?:            Withdraw;
}

export interface Deposit {
    /**
     * The amount to increase.
     */
    amount: number;
    /**
     * The DA address of the sequencer.
     */
    da_address: string;
    [property: string]: any;
}

export interface InitiateWithdrawal {
    /**
     * The DA address of the sequencer you're removing.
     */
    da_address: string;
    [property: string]: any;
}

export interface Register {
    /**
     * The initial balance of the sequencer.
     */
    amount: number;
    /**
     * The Da address of the sequencer you're registering.
     */
    da_address: string;
    [property: string]: any;
}

export interface Withdraw {
    /**
     * The DA address of the sequencer you're removing.
     */
    da_address: string;
    [property: string]: any;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toRuntimeCall(json: string): RuntimeCall {
        return cast(JSON.parse(json), r("RuntimeCall"));
    }

    public static runtimeCallToJson(value: RuntimeCall): string {
        return JSON.stringify(uncast(value, r("RuntimeCall")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "RuntimeCall": o([
        { json: "accounts", js: "accounts", typ: u(undefined, r("CallMessage")) },
        { json: "uniqueness", js: "uniqueness", typ: u(undefined, null) },
        { json: "bank", js: "bank", typ: u(undefined, r("CallMessage2")) },
        { json: "sequencer_registry", js: "sequencer_registry", typ: u(undefined, r("CallMessage3")) },
        { json: "attester_incentives", js: "attester_incentives", typ: u(undefined, u(r("CallMessage4Class"), r("CallMessage4Enum"))) },
        { json: "prover_incentives", js: "prover_incentives", typ: u(undefined, u(r("CallMessage5Class"), r("CallMessage5Enum"))) },
        { json: "example_module", js: "example_module", typ: u(undefined, r("CallMessage6")) },
        { json: "reddit_module", js: "reddit_module", typ: u(undefined, r("CallMessage7")) },
        { json: "chain_state", js: "chain_state", typ: u(undefined, null) },
        { json: "blob_storage", js: "blob_storage", typ: u(undefined, null) },
        { json: "paymaster", js: "paymaster", typ: u(undefined, r("CallMessage8")) },
    ], false),
    "CallMessage": o([
        { json: "insert_credential_id", js: "insert_credential_id", typ: "" },
    ], false),
    "CallMessage4Class": o([
        { json: "register_attester", js: "register_attester", typ: u(undefined, 0) },
        { json: "register_challenger", js: "register_challenger", typ: u(undefined, 0) },
        { json: "deposit_attester", js: "deposit_attester", typ: u(undefined, 0) },
    ], false),
    "CallMessage2": o([
        { json: "create_token", js: "create_token", typ: u(undefined, r("CreateToken")) },
        { json: "transfer", js: "transfer", typ: u(undefined, r("Transfer")) },
        { json: "burn", js: "burn", typ: u(undefined, r("Burn")) },
        { json: "mint", js: "mint", typ: u(undefined, r("Mint")) },
        { json: "freeze", js: "freeze", typ: u(undefined, r("Freeze")) },
    ], false),
    "Burn": o([
        { json: "coins", js: "coins", typ: r("Coins") },
    ], "any"),
    "Coins": o([
        { json: "amount", js: "amount", typ: 0 },
        { json: "token_id", js: "token_id", typ: "" },
    ], "any"),
    "CreateToken": o([
        { json: "admins", js: "admins", typ: a("") },
        { json: "initial_balance", js: "initial_balance", typ: 0 },
        { json: "mint_to_address", js: "mint_to_address", typ: "" },
        { json: "supply_cap", js: "supply_cap", typ: u(undefined, u(0, null)) },
        { json: "token_decimals", js: "token_decimals", typ: u(undefined, u(0, null)) },
        { json: "token_name", js: "token_name", typ: "" },
    ], "any"),
    "Freeze": o([
        { json: "token_id", js: "token_id", typ: "" },
    ], "any"),
    "Mint": o([
        { json: "coins", js: "coins", typ: r("Coins") },
        { json: "mint_to_address", js: "mint_to_address", typ: "" },
    ], "any"),
    "Transfer": o([
        { json: "coins", js: "coins", typ: r("Coins") },
        { json: "to", js: "to", typ: "" },
    ], "any"),
    "CallMessage6": o([
        { json: "set_value", js: "set_value", typ: 0 },
    ], false),
    "UpdatePolicy": o([
        { json: "payer", js: "payer", typ: "" },
        { json: "update", js: "update", typ: r("CallMessage8") },
    ], "any"),
    "CallMessage8": o([
        { json: "register_paymaster", js: "register_paymaster", typ: u(undefined, r("RegisterPaymaster")) },
        { json: "set_payer_for_sequencer", js: "set_payer_for_sequencer", typ: u(undefined, r("SetPayerForSequencer")) },
        { json: "update_policy", js: "update_policy", typ: u(undefined, r("UpdatePolicy")) },
    ], false),
    "RegisterPaymaster": o([
        { json: "policy", js: "policy", typ: r("PaymasterPolicyInitializer") },
    ], "any"),
    "PaymasterPolicyInitializer": o([
        { json: "authorized_sequencers", js: "authorized_sequencers", typ: u(r("AuthorizedSequencersClass"), r("AuthorizedSequencersEnum")) },
        { json: "authorized_updaters", js: "authorized_updaters", typ: a("") },
        { json: "default_payee_policy", js: "default_payee_policy", typ: u(r("PayeePolicyClass"), r("PayeePolicyEnum")) },
        { json: "payees", js: "payees", typ: a(a(u(r("PayeePolicyClass"), ""))) },
    ], "any"),
    "AuthorizedSequencersClass": o([
        { json: "some", js: "some", typ: a("") },
    ], false),
    "PayeePolicyClass": o([
        { json: "allow", js: "allow", typ: r("Allow") },
    ], false),
    "Allow": o([
        { json: "gas_limit", js: "gas_limit", typ: u(undefined, u(a(3.14), null)) },
        { json: "max_fee", js: "max_fee", typ: u(undefined, u(0, null)) },
        { json: "max_gas_price", js: "max_gas_price", typ: u(undefined, u(a(3.14), null)) },
        { json: "transaction_limit", js: "transaction_limit", typ: u(undefined, u(0, null)) },
    ], "any"),
    "SetPayerForSequencer": o([
        { json: "payer", js: "payer", typ: "" },
    ], "any"),
    "CallMessage5Class": o([
        { json: "register", js: "register", typ: u(undefined, 0) },
        { json: "deposit", js: "deposit", typ: u(undefined, 0) },
    ], false),
    "CallMessage7": o([
        { json: "create_user", js: "create_user", typ: u(undefined, r("CreateUser")) },
        { json: "create_sub_reddit", js: "create_sub_reddit", typ: u(undefined, r("CreateSubReddit")) },
        { json: "create_post", js: "create_post", typ: u(undefined, r("CreatePost")) },
    ], false),
    "CreatePost": o([
        { json: "content", js: "content", typ: "" },
        { json: "flair", js: "flair", typ: "" },
        { json: "subaddress", js: "subaddress", typ: "" },
        { json: "title", js: "title", typ: "" },
    ], "any"),
    "CreateSubReddit": o([
        { json: "description", js: "description", typ: "" },
        { json: "subname", js: "subname", typ: "" },
        { json: "user_address", js: "user_address", typ: "" },
    ], "any"),
    "CreateUser": o([
        { json: "username", js: "username", typ: "" },
    ], "any"),
    "CallMessage3": o([
        { json: "register", js: "register", typ: u(undefined, r("Register")) },
        { json: "deposit", js: "deposit", typ: u(undefined, r("Deposit")) },
        { json: "initiate_withdrawal", js: "initiate_withdrawal", typ: u(undefined, r("InitiateWithdrawal")) },
        { json: "withdraw", js: "withdraw", typ: u(undefined, r("Withdraw")) },
    ], false),
    "Deposit": o([
        { json: "amount", js: "amount", typ: 0 },
        { json: "da_address", js: "da_address", typ: "" },
    ], "any"),
    "InitiateWithdrawal": o([
        { json: "da_address", js: "da_address", typ: "" },
    ], "any"),
    "Register": o([
        { json: "amount", js: "amount", typ: 0 },
        { json: "da_address", js: "da_address", typ: "" },
    ], "any"),
    "Withdraw": o([
        { json: "da_address", js: "da_address", typ: "" },
    ], "any"),
    "CallMessage4Enum": [
        "begin_exit_attester",
        "exit_attester",
        "exit_challenger",
    ],
    "AuthorizedSequencersEnum": [
        "all",
    ],
    "PayeePolicyEnum": [
        "deny",
    ],
    "CallMessage5Enum": [
        "exit",
    ],
};
