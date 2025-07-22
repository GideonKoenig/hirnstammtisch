export type BaseUnwrapConfig<T> = {
    errorMessage?: string;
    notFoundMessage?: string;
    expectation?: undefined;
    defaultValue?: T;
};

export type UnwrapConfigExpectSingle<T> = {
    errorMessage?: string;
    notFoundMessage?: string;
    expectation: "expectSingle";
    defaultValue?: ExtractArrayElement<T>;
};

export type UnwrapConfigOther = {
    errorMessage?: string;
    notFoundMessage?: string;
    expectation: "expectAtLeastOne" | "expectNothing";
};

export type UnwrapConfig<T> =
    | UnwrapConfigExpectSingle<T>
    | UnwrapConfigOther
    | BaseUnwrapConfig<T>;

export type Success<T> = {
    success: true;
    data: T;
};

export type Failure = {
    success: false;
    error: string;
};

export type Result<T> = Success<T> | Failure;

export type ExtractArrayElement<T> = T extends (infer U)[] ? U : T;
export type NonEmptyArray<T> = T extends (infer U)[] ? [U, ...U[]] : T;
