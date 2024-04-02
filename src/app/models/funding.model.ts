export class Funding {
    fundingAddress!: {
        address: string;
        alias: string;
    };
    date!: Date;
    amount!: number;

    fromTzkt(input: TzktResponseFunding) {
        this.fundingAddress = {
            address: input.sender.address,
            alias: input.sender.alias ? input.sender.alias : ''
        }
        this.amount = input.amount
        this.date = new Date(input.timestamp)
        return this
    }
}


export class TzktResponseFunding {
    amount: number = 0;
    sender: {
        address: string;
        alias?: string;
    } = {
        address: '',
        alias: ''
    };
    timestamp: string = ''
}