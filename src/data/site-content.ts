import type { LucideIcon } from "lucide-react";
import { BookOpen, HeartHandshake, Music2, Sparkles, Users, UsersRound } from "lucide-react";

export type Ministry = {
	name: string;
	description: string;
	icon: LucideIcon;
};

export const ministries: Ministry[] = [
	{ name: "Children", description: "A joyful place for little ones to learn about God's love.", icon: Sparkles },
	{ name: "Teens & Youth", description: "Growing in faith, friendship, and purpose together.", icon: UsersRound },
	{ name: "Young Adults", description: "Finding community and direction for every next step.", icon: Users },
	{ name: "Men & Women", description: "Building one another up through fellowship and faith.", icon: HeartHandshake },
	{ name: "Choir & Music", description: "Making room for worship through music and creativity.", icon: Music2 },
	{ name: "Evangelism & Media", description: "Sharing the good news and the stories of our church.", icon: BookOpen },
];

export const serviceInformation = {
	day: "Sunday worship",
	time: "Service time to be confirmed",
	address: "Church address to be added",
};
