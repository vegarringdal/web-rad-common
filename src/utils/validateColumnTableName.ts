export const validateColumnTableName = function (value: any, allowDot = false): string {
    if (typeof value !== "string") {
        throw "is missing or not string";
    }

    let values = [value];
    if (allowDot) {
        values = value.split(".");
    }

    values.forEach((val) => {
        if (!/^[A-Za-z_]+$/.test(val)) {
            //check value
            throw "illiegal characters in column name, only allowed [A-Za-z_]";
        }
    });

    return values.join(".").toUpperCase();
};
