import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { MetricResponse } from "@trophyso/node/api";
import { Trophy } from "lucide-react";

interface Props {
    progress: MetricResponse | null;
}

export default function Userbox({ progress }: Props) {
    console.log(progress);

    return (
        <div className="absolute top-10 right-10 z-50">
            <Popover>
                <PopoverTrigger>
                    <div className="h-12 w-12 cursor-pointer hover:opacity-80 duration-100 border-1 border-gray-300 shadow-sm transition-all rounded-full relative">
                        <Trophy className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <div>Streak</div>
                    <Separator />
                    <div>Badges</div>
                </PopoverContent>
            </Popover>
        </div>
    )
}