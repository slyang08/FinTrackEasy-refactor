const iconMap = {
    "Food & Drink": "FoodNDrink",
    Car: "Car",
    Shopping: "Shopping",
    "Bills & Fees": "BillsNFees",
    Home: "Home",
    Entertainment: "Entertainment",
    Travel: "Travel",
    Healthcare: "Healthcare",
    "Family & Personal": "FamilyNPersona",
    Transport: "Transport",
    Other: null,
    Gift: "Gift",
    Salary: "Salary",
    "Extra Income": "ExtraIncome",
    Loan: "Loan",
    "Parental Leave": "ParentalLeave",
    Business: "Business",
    "Insurance Payout": "InsurancePayout",
};

export default function CategoryIcon({ icon, type, className, ...props }) {
    if (!iconMap[icon])
        return (
            <span
                className={className ? className : "h-5 w-5"}
                aria-hidden="true"
                {...props}
            ></span>
        );
    return (
        <img
            src={`/${type.toLowerCase()}/${iconMap[icon]}.svg`}
            alt={icon}
            className={className ? className : "h-6 w-6"}
            {...props}
        />
    );
}
