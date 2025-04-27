import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { MetricResponse } from "@trophyso/node/api";
const AVATAR_URL = "https://gravatar.com/avatar/1234?f=y&d=mp";

interface Props {
    progress: MetricResponse | null;
}

export default function Userbox({ progress }: Props) {
    console.log(progress);

    return (
        <div className="absolute top-10 right-10 z-50">
            <Popover>
                <PopoverTrigger>
                    <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 duration-100 border-1 border-gray-300 shadow-sm transition-all">
                        <AvatarImage src={AVATAR_URL} />
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={AVATAR_URL} />
                            </Avatar>
                            <p className="text-sm font-medium text-gray-700">John Doe</p>
                        </div>
                        <Separator />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}