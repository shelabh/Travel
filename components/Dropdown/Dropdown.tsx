
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSession, signOut } from "next-auth/react"
import router from 'next/router';

 
const Dropdown = () => {
	const {data: session} = useSession()
	const handleSignOut = () => {
		signOut({callbackUrl: '/'})
	}
	return (
		<div>
			<DropdownMenu.Root >
				<DropdownMenu.Trigger className="border-2  cursor-pointer rounded-lg w-40 flex flex-row items-center gap-2 justify-center pt-1.5 pb-1.5 focus:outline-none">
					{session && 
						<div>
							{session?.user?.name}
						</div>
					}
					<div>
						<img src="/images/Dropdown.svg" alt="dropdown" draggable="false" className=' rotate-180 md:rotate-0'/>
					</div>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content sideOffset={8} align="end" className="z-100  md:backdrop-blur-sm md:bg-gradient-to-br from-black/30 via-black/20 to-black/10  md:w-60 w-40   md:pt-2 pt-1 pb-1 md:pb-2 border-2 flex flex-col  rounded-lg  ">
					<DropdownMenu.Item onClick={() => router.push('/app/dashboard')} className='focus:outline-none cursor-pointer hover:underline-offset-2 hover:underline hover:bg-white/20 p-2'>
						Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item onClick={() => router.push('/app/wishlist')} className='focus:outline-none cursor-pointer hover:underline-offset-2 hover:underline hover:bg-white/20 p-2'>
						Wishlist
					</DropdownMenu.Item>
					<DropdownMenu.Item onClick={() => handleSignOut()} className='focus:outline-none cursor-pointer hover:underline-offset-2 hover:underline hover:bg-white/20 p-2'>
						Sign Out
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	)
}

export default Dropdown