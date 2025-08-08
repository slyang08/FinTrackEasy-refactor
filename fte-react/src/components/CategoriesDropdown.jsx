import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import CategoryIcon from "./icons/CategoryIcon";

export default function CategoriesDropdown({
    categories,
    type,
    value,
    onValueChange,
    isInvalid,
    ...props
}) {
    return (
        <Select value={value} onValueChange={onValueChange} {...props}>
            <SelectTrigger
                className={`w-full ${isInvalid && "border-red-500 focus-visible:ring-red-500"}`}
            >
                {value ? (
                    <SelectValue />
                ) : (
                    <div className="flex gap-2">
                        <img src="/AddCategory.svg" alt="" className="w-5 h-5" />
                        <div>{value || "Select Category"}</div>
                    </div>
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                            <CategoryIcon icon={category.value} type={type} />
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
