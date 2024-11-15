import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"

export default function Search({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-8"
      />
    </div>
  )
}