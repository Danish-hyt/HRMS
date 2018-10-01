export interface TimeSheet {
    id?: string;
    date: string;
    dateObj: {
        year: number,
        month: number,
        day: number
    };
    project: string;
    task: string;
    hours: number;
}

export interface Date {
    year: number;
    month: number;
    day: number;
}
