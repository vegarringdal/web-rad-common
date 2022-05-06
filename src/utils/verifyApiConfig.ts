import { ApiColumnError, ApiInterface, ApiInterfaceError } from "./ApiInterface";
import { validateColumnTableName } from "./validateColumnTableName";

/**
 * helps validate/fix issues/set defaults on config
 * @param configInput
 * @returns
 */
export function verifyApiConfig(configInput: ApiInterface): [ApiInterface, ApiInterfaceError, number] {
    const config = configInput || ({} as ApiInterface);

    const errorLog = {} as ApiInterfaceError;

    let errorCount: number = 0;

    if (!config.apiName) {
        errorLog.apiName = "Missing";
        errorCount++;
    }

    if (!config.viewName) {
        errorLog.viewName = "Missing";
        errorCount++;
    }

    try {
        validateColumnTableName(config.viewName, true);
        config.viewName = config.viewName.toUpperCase();
    } catch (e) {
        errorLog.viewName = e;
        errorCount++;
    }

    if (!config.project) {
        config.project = null;
    }

    if (config.accessUpdate && !Array.isArray(config.accessUpdate)) {
        errorLog.accessInsert = "need to be array";
    }

    if (config.accessDelete && !Array.isArray(config.accessDelete)) {
        errorLog.accessInsert = "need to be array";
    }

    if (config.accessInsert && !Array.isArray(config.accessInsert)) {
        errorLog.accessInsert = "need to be array";
    }

    if (!config.primaryKey) {
        errorLog.primaryKey = "Missing";
        errorCount++;
    }

    try {
        validateColumnTableName(config.primaryKey);
        config.primaryKey = config.primaryKey.toUpperCase();
    } catch (e) {
        errorLog.primaryKey = e;
        errorCount++;
    }

    if (config.childViewApi) {
        if (!config.childTo) {
            errorLog.childTo = "Missing, needed when childViewApi is used ";
            errorCount++;
        }

        try {
            validateColumnTableName(config.childTo);
            config.childTo = config.childTo.toUpperCase();
        } catch (e) {
            errorLog.childTo = e;
            errorCount++;
        }

        if (!config.childFrom) {
            errorLog.childFrom = "Missing, needed when childViewApi is used ";
            errorCount++;
        }

        try {
            validateColumnTableName(config.childFrom);
            config.childFrom = config.childFrom.toUpperCase();
        } catch (e) {
            errorLog.childFrom = e;
            errorCount++;
        }
    }

    if (config.modified) {
        try {
            validateColumnTableName(config.modified);
            config.modified = config.modified.toUpperCase();
        } catch (e) {
            errorLog.modified = e;
            errorCount++;
        }
    }

    if (config.project) {
        try {
            validateColumnTableName(config.project);
            config.project = config.project.toUpperCase();
        } catch (e) {
            errorLog.project = e;
            errorCount++;
        }
    }

    errorLog.columns = [];
    config.columns.forEach((col) => {
        const errorCol = {} as ApiColumnError;
        errorLog.columns.push(errorCol);

        if (!col.name) {
            errorCol.name = "Missing";
            errorCount++;
        }

        try {
            validateColumnTableName(col.name);
            col.name = col.name.toUpperCase();
        } catch (e) {
            errorCol.name = e;
            errorCount++;
        }

        // todo, fix label?

        if (!col.type) {
            col.type = "text";
        }

        if (col.removeFromGrid) {
            col.removeFromGrid = true;
        }

        if (col.setAsOptionalInGrid) {
            col.setAsOptionalInGrid = true;
        }

        if (col.readOnlyGrid) {
            col.readOnlyGrid = true;
        }

        if (col.accessUpdate && !Array.isArray(col.accessUpdate)) {
            errorCol.accessUpdate = "need to be array";
            errorCount++;
        }

        if (col.isCheckbox) {
            col.isCheckbox = true;

            if (!col.checkboxChecked) {
                errorCol.checkboxChecked = "Needed when setting isCheckbox ";
                errorCount++;
            }
        } else {
            if (col.checkboxChecked) {
                delete col.checkboxChecked;
            }
        }

        if (col.parentViewApi) {
            if (!col.parentViewType) {
                col.parentViewType = "DIALOG-WITH-OVERLAY";
            }

            if (!col.parentTitle) {
                col.parentTitle = "Add parent";
            }

            if (!col.parentFrom) {
                errorCol.parentFrom = "Needed when setting parentViewApi ";
                errorCount++;
            }

            try {
                validateColumnTableName(col.parentFrom);
                col.parentFrom = col.parentFrom.toUpperCase();
            } catch (e) {
                errorCol.parentFrom = e;
                errorCount++;
            }

            if (!col.parentTo) {
                errorCol.parentTo = "Needed when setting parentViewApi ";
                errorCount++;
            }

            try {
                validateColumnTableName(col.parentTo);
                col.parentTo = col.parentTo.toUpperCase();
            } catch (e) {
                errorCol.parentTo = e;
                errorCount++;
            }
        } else {
            if (col.parentViewType) {
                delete col.parentViewType;
            }

            if (col.parentTitle) {
                delete col.parentTitle;
            }

            if (col.parentFrom) {
                delete col.parentViewType;
            }

            if (col.parentTo) {
                delete col.parentTitle;
            }
        }

        if (col.parentColumnsFromTo && !Array.isArray(col.parentColumnsFromTo)) {
            errorCol.parentColumnsFromTo = "needs to be array of array [[string, string], [string, string]] ";
            errorCount++;
            // todo, check inner
        }
    });

    return [config, errorLog, errorCount];
}