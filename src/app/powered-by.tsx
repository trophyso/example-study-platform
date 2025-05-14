import Image from "next/image";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";

export default function PoweredBy() {
    return (
        <HoverCard openDelay={0}>
            <HoverCardTrigger>
                <div className="mt-5 flex items-center gap-2">
                    <p>Powered by</p>
                    <a href="https://trophy.so" target="_blank" className="inline-flex items-center gap-1 border border-gray-300 rounded-sm shadow-sm h-8 p-1">
                        <Image
                            src="/logo_light.svg"
                            alt="Powered by Trophy"
                            width={100}
                            height={100}
                            className="w-20 h-5"
                        />
                    </a>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-min">
                <div className="flex flex-col gap-3">
                    <Image
                        src="/logomark_light.svg"
                        alt="Trophy"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                            <div className="font-bold">Trophy</div>
                            <div className="text-muted-foreground">
                                <a href="https://github.com/trophyso" className="hover:underline" target="_blank">
                                    @trophyso
                                </a>
                            </div>
                        </div>
                        <div className="text-sm">
                            Ship gamification in hours, not months.
                        </div>
                        <div className="flex gap-2">
                            <div className="flex gap-1">
                                <Button variant="secondary" className="cursor-pointer" asChild>
                                    <a href="https://examples.trophy.so" target="_blank">
                                        More examples
                                    </a>
                                </Button>
                            </div>
                            <div className="flex gap-1">
                                <Button className="cursor-pointer" asChild>
                                    <a href="https://app.trophy.so/sign-up" target="_blank">
                                        Get started
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}