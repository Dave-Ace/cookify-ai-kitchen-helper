import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { Users, Mail, Bell, TrendingUp, DollarSign, Activity, Send } from "lucide-react";
import { toast } from "sonner";

// --- MOCK DATA ---
const mockUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", plan: "Pro", joined: "2024-01-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Active", plan: "Free", joined: "2024-01-20" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", status: "Inactive", plan: "Free", joined: "2024-02-01" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", status: "Active", plan: "Pro", joined: "2024-02-10" },
    { id: 5, name: "Evan Wright", email: "evan@example.com", status: "Banned", plan: "Free", joined: "2024-02-15" },
];

const activityData = [
    { name: "Mon", users: 400, recipes: 240 },
    { name: "Tue", users: 300, recipes: 139 },
    { name: "Wed", users: 500, recipes: 980 },
    { name: "Thu", users: 278, recipes: 390 },
    { name: "Fri", users: 689, recipes: 480 },
    { name: "Sat", users: 839, recipes: 680 },
    { name: "Sun", users: 480, recipes: 390 },
];

const revenueData = [
    { name: "Week 1", revenue: 4000 },
    { name: "Week 2", revenue: 3000 },
    { name: "Week 3", revenue: 5000 },
    { name: "Week 4", revenue: 6500 },
];

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Push notification sent to all devices!");
        }, 1500);
    };

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Newsletter queued for delivery!");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Monitor performance and manage your application</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Export Data</Button>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12,345</div>
                            <p className="text-xs text-muted-foreground">+180 from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">573</div>
                            <p className="text-xs text-muted-foreground">+201 since last hour</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recipe Generations</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-muted-foreground">+19% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₦4,231,000</div>
                            <p className="text-xs text-muted-foreground">+7% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList >
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="communication">Communication</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>User Activity</CardTitle>
                                    <CardDescription>Daily active users vs recipes generated</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={activityData}>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            />
                                            <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Active Users" />
                                            <Bar dataKey="recipes" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Recipes Generated" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>Revenue Trend</CardTitle>
                                    <CardDescription>Monthly recurring revenue growth</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={revenueData}>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            />
                                            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>Manage user accounts and permissions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mb-4">
                                    <Input placeholder="Search users by name or email..." className="max-w-sm" />
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Plan</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                            user.status === 'Banned' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.plan === 'Pro' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        }`}>
                                                        {user.plan}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{user.joined}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">Manage</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" /> Push Notifications
                                    </CardTitle>
                                    <CardDescription>Send instant alerts to all users' devices.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSendNotification} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Notification Title</Label>
                                            <Input placeholder="e.g. New Week, New Recipes!" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Message Body</Label>
                                            <Textarea placeholder="Write your alert message here..." required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Target Audience</Label>
                                            <Input value="All Users" disabled />
                                        </div>
                                        <Button type="submit" disabled={isLoading} className="w-full">
                                            {isLoading ? "Sending..." : "Send Push Notification"} <Send className="w-4 h-4 ml-2" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="w-5 h-5" /> Email Newsletter
                                    </CardTitle>
                                    <CardDescription>Send rich text newsletters or updates via email.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSendEmail} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Subject Line</Label>
                                            <Input placeholder="e.g. SousAI Weekly Digest" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email Content (HTML supported)</Label>
                                            <Textarea className="min-h-[150px]" placeholder="<h1>Hello Chefs!</h1>..." required />
                                        </div>
                                        <Button type="submit" variant="secondary" disabled={isLoading} className="w-full">
                                            {isLoading ? "Queuing..." : "Queue for Delivery"} <Mail className="w-4 h-4 ml-2" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Settings</CardTitle>
                                <CardDescription>Configure global application settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Global settings configuration coming soon...</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;
