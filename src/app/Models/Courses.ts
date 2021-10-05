export class Courses{
    CourseName : string;
    Classes : string[];
    CreditHrs : number;
}

export class showClasses {
    show : boolean;
}

export class SelectedClass {
    SlctClass : string[];
}

export class Users {
    _id : string;
    Name : string;
    Username : string;
    Courses: [{
        CourseName: string;
        CreditHrs : number;
        Classes : string[];
    }]
}

export class Percentage{
    Name : string;
    Percentage : Number;
    Username : string
}