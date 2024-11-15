import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              CRM System
            </Link>
          </div>
          
          <div className="flex gap-4">
            <Link href="/customers">
              <Button variant="ghost">Customers</Button>
            </Link>
            <Link href="/segments">
              <Button variant="ghost">Segments</Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="ghost">Campaigns</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}