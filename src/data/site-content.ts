import type { LucideIcon } from "lucide-react";
import { BookOpen, HeartHandshake, Music2, Users, UsersRound } from "lucide-react";

export type Ministry = {
	name: string;
	slug: string;
	description: string;
	heading: string;
	story: string;
	icon: LucideIcon;
	image?: string;
};

export const ministries: Ministry[] = [
	{ name: "Children", slug: "children", description: "A joyful place for little ones to learn about God's love.", heading: "A safe, joyful place where children can grow in faith and feel loved.", story: "We believe every child is a gift and every smile matters. Our Children’s ministry creates a warm, welcoming space where little ones can learn Bible truths, make friends, and experience the love of Jesus in a simple and meaningful way. Through songs, prayer, teaching, and encouragement, children are helped to discover God’s love early and grow with confidence in a caring church family. We want every child to know they are seen, valued, and deeply loved by God and by the people around them.", icon: UsersRound, image:"/images/children.jpg" },
	{ name: "Teens & Youth", slug: "teens-youth", description: "Growing in faith, friendship, and purpose together.", heading: "A place where young people are seen, heard, and encouraged to grow.", story: "Teens and young people are navigating life, identity, and purpose. This ministry offers a place to belong, ask honest questions, grow in faith, and build real friendships grounded in Christ and community. We create space for discipleship, mentorship, and belonging so that young people can walk confidently in their calling and know they are never alone. Our goal is to help every young person encounter Jesus, find their voice, and discover the strength that comes from being part of a loving church family.", icon: UsersRound, image:"/images/teens-youth.jpg" },
	{ name: "Young Adults", slug: "young-adults", description: "Finding community and direction for every next step.", heading: "A place for purpose, connection, and spiritual growth.", story: "Young adulthood can be exciting, busy, and full of change. We create spaces for meaningful conversations, spiritual encouragement, and practical support as people discover their calling and live out their faith in everyday life. This ministry helps young adults build strong relationships, deepen their walk with God, and grow into the kind of leaders and disciples who bless their families, church, and communities. We believe faith is not just for Sundays; it is for the real, everyday moments that shape our future.", icon: Users, image:"/images/young-adults.jpg" },
	{ name: "Men & Women", slug: "men-women", description: "Building one another up through fellowship and faith.", heading: "Encouragement, accountability, and friendship for every season.", story: "Men and women are strengthened through prayer, fellowship, and honest encouragement. In this ministry, we support one another, build lasting relationships, and grow in character, wisdom, and faith together. We believe spiritual growth is stronger when it happens in community, and this space helps people stand firm, serve faithfully, and carry one another through every season of life. Here, people are challenged to grow in Christ and encouraged to live with integrity, humility, and love.", icon: HeartHandshake, image:"/images/men-women.jpg" },
	{ name: "Choir & Music", slug: "choir-music", description: "Making room for worship through music and creativity.", heading: "Using music to lift worship and stir hearts toward God.", story: "Music is a powerful way to worship and connect. Our choir and music ministry helps believers express gratitude, lead in worship, and create an atmosphere where the presence of God is welcomed and experienced together. Through harmony, creativity, and passionate praise, we help the church worship with joy, unity, and a deep sense of the Holy Spirit. This ministry gives people a voice to glorify God and to help others encounter His presence in a deeply personal and moving way.", icon: Music2, image:"/images/choir-music.jpg" },
	{ name: "Evangelism & Media", slug: "evangelism-media", description: "Sharing the good news and the stories of our church.", heading: "Sharing the gospel and telling the story of hope.", story: "Through evangelism, outreach, and media, we reach people with the message of Christ in practical and relevant ways. We believe every story matters and that the good news of Jesus should be shared with compassion, creativity, and courage. This ministry helps the church reach beyond its walls, connect with the wider community, and communicate the transforming power of Christ through words, images, and meaningful outreach. It is a call to help people hear the gospel clearly, encounter hope, and discover the life-changing love of Jesus.", icon: BookOpen, image:"/images/evangelism-media.jpg" },
];

export const serviceInformation = {
	day: "Sunday worship",
	schedule: [
		{ label: "Workers Prayer & Training", time: "7:00 AM" },
		{ label: "Sunday School", time: "8:00 AM" },
		{ label: "Service Starts", time: "9:00 AM" },
	],
	address: "11, Odu-Onikosi Avenue, Opposite Lasued, Otto-Awori, Lagos.",
};
