let validators = {
    emptyStrings: function (input: string): boolean {
        if (input.trim().length == 0) {
            return true;
        } else {
            return false;
        }
    },
    checkParams: function (input: string) {
        if (!this.emptyStrings(input)) {
            if (!input.includes('\'') && !input.includes('-') && !input.includes('\"')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

export default validators;