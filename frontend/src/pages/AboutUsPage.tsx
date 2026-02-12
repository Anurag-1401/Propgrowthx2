import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Eye, 
  Shield, 
  Zap, 
  ChevronDown, 
  BarChart3,
  Lock,
  CheckCircle,
  Clock,
  Award,
  Smartphone,
  Lightbulb,
  Target,
  Layers,
  Rocket,
  Heart
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const propertyManagementImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop";
const tenantCommunicationImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop";

const AboutUsPage: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const handleGetStarted = async () => {
        try {
            const { data } = await supabase.auth.getUser();
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            if ((data && data.user) || token) {
                if (role === 'owner') navigate('/dashboard/owner');
                else if (role === 'tenant') navigate('/dashboard/tenant');
                else navigate('/dashboard/owner');
            } else {
                navigate('/auth');
            }
        } catch (err) {
            navigate('/auth');
        }
    };

    useEffect(() => {
        document.title = 'About PropGrowthX - Remote Property Management Platform';
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'PropGrowthX: The digital twin platform for property owners. Manage rentals, tenants, maintenance, and finances remotely with real-time visibility and control.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'PropGrowthX: The digital twin platform for property owners. Manage rentals, tenants, maintenance, and finances remotely with real-time visibility and control.';
            document.head.appendChild(meta);
        }
        
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', 'property management, rental management, tenant management, property digital twin, remote property management, real estate SaaS, landlord software, rent collection');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'keywords';
            meta.content = 'property management, rental management, tenant management, property digital twin, remote property management, real estate SaaS, landlord software, rent collection';
            document.head.appendChild(meta);
        }

        setIsVisible(true);
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-white overflow-hidden">
                {/* Enhanced Hero Section */}
                <div className="relative bg-white overflow-hidden border-b border-gray-200">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-black rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                                        linear-gradient(to bottom, #000 1px, transparent 1px)`,
                        backgroundSize: '4rem 4rem',
                    }}></div>
                </div>
                
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center justify-center mb-6 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium">
                            <Zap className="w-4 h-4 mr-2" />
                            Transforming Property Management
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black tracking-tight leading-tight mb-6">
                            About <span className="text-red-600">PropGrowthX</span>
                        </h1>
                        <p className="mt-8 max-w-4xl mx-auto text-xl sm:text-2xl text-gray-700 leading-relaxed font-light">
                            PropGrowthX is a <span className="font-semibold text-black">remote property management platform</span> that creates a <span className="font-semibold text-black">digital twin of every property</span>. We empower property owners, brokers, and managers with <span className="font-semibold text-black">real-time visibility, automated workflows, and data-driven insights</span> to manage properties efficiently without physical visits.
                        </p>
                        
                        {/* Scroll Indicator */}
                        <div className="mt-12 flex justify-center">
                            <div className="animate-pulse">
                                <ChevronDown className="w-8 h-8 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">

                {/* The Problem Section */}
                <div className={`text-center mb-20 lg:mb-28 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="inline-block mb-3">
                        <div className="w-12 h-1 bg-red-600 mx-auto mb-2"></div>
                        <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">The Challenge</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">The Problem We Solve</h2>
                    <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-12">Property owners today rely on outdated methods that create chaos, uncertainty, and lost control.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mt-12 max-w-2xl mx-auto">
                        <ProblemCard 
                            icon={Clock}
                            title="Manual Workflows"
                            description="Excel sheets, WhatsApp messages, and physical visits consume time"
                            variant="red"
                        />
                        <ProblemCard 
                            icon={TrendingUp}
                            title="Lost Payments"
                            description="No automated tracking leads to missed reminders and overdue rent"
                            variant="red"
                        />
                        <ProblemCard 
                            icon={Eye}
                            title="No Visibility"
                            description="Owners lack control and certainty about property status"
                            variant="red"
                        />
                        <ProblemCard 
                            icon={Lightbulb}
                            title="Missed Opportunities"
                            description="Without data, owners can't optimize pricing"
                            variant="red"
                        />
                    </div>
                </div>

                {/* Core Solution Section */}
                <div className={`text-center mb-20 lg:mb-28 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="inline-block mb-3">
                        <div className="w-12 h-1 bg-red-600 mx-auto mb-2"></div>
                        <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Our Solution</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">The Digital Twin Platform</h2>
                    <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-16">Every property gets a digital presence that gives owners complete control and visibility—without ever visiting the property.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
                        <SolutionCard 
                            icon={Building2}
                            title="Property Digital Twin"
                            description="Complete digital profile with tenant data, lease timelines, and payment history"
                            delay="0"
                            bgColor="from-red-500"
                            borderColor="border-red-200"
                        />
                        <SolutionCard 
                            icon={Users}
                            title="Tenant Management"
                            description="Centralized tenant information, automated communication, and complaint management"
                            delay="100"
                            bgColor="from-red-500"
                            borderColor="border-red-200"
                        />
                        <SolutionCard 
                            icon={Zap}
                            title="Automated Workflows"
                            description="Smart reminders, rent tracking, maintenance tickets, and vendor assignment"
                            delay="200"
                            bgColor="from-red-500"
                            borderColor="border-red-200"
                        />
                        <SolutionCard 
                            icon={BarChart3}
                            title="Financial Intelligence"
                            description="Real-time rent status, ROI calculations, and pricing benchmarks"
                            delay="300"
                            bgColor="from-red-500"
                            borderColor="border-red-200"
                        />
                        <SolutionCard 
                            icon={Lock}
                            title="Secure & Reliable"
                            description="Bank-level security, encrypted data storage, and 99.5% uptime guarantee"
                            delay="400"
                            bgColor="from-red-500"
                            borderColor="border-red-200"
                        />
                        <SolutionCard 
                            icon={Target}
                            title="Complete Control"
                            description="Every action reflects on your digital twin—full visibility without manual visits"
                            delay="500"
                            bgColor="from-red-500"
                            borderColor="border-red-200"
                        />
                    </div>
                </div>

                {/* Enhanced Feature Sections */}
                <div className="space-y-20 lg:space-y-32">
                    {/* Rent Collection & Reminders */}
                    <EnhancedFeatureSection
                        title="Automated Rent Collection & Smart Reminders"
                        description="Say goodbye to chasing tenants. Our platform sends <strong class='text-black'>automated WhatsApp and SMS reminders</strong>, tracks <strong class='text-black'>promise-to-pay commitments</strong>, and provides <strong class='text-black'>instant payment confirmation</strong>. Owners see real-time rent status, overdue tracking, and collection history—all in one dashboard."
                        imageSrc={propertyManagementImage}
                        imageAlt="Rent Collection Dashboard"
                        reversed={false}
                        badge={{
                            icon: Clock,
                            text: "Automated Collection"
                        }}
                    />

                    {/* Maintenance & Operations */}
                    <EnhancedFeatureSection
                        title="Seamless Maintenance & Operations Management"
                        description="Track every maintenance request from creation to completion. Create <strong class='text-black'>job tickets, assign vendors, upload completion proof</strong>, and maintain a complete <strong class='text-black'>maintenance history</strong>. Owners never miss a repair, and vendors get clear assignments with photo documentation."
                        imageSrc={tenantCommunicationImage}
                        imageAlt="Maintenance Management"
                        reversed={true}
                        badge={{
                            icon: Zap,
                            text: "Operational Control"
                        }}
                    />
                </div>

                {/* Core Features Grid */}
                <div className={`mt-20 lg:mt-28 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center mb-16">
                        <div className="inline-block mb-3">
                            <div className="w-12 h-1 bg-red-600 mx-auto mb-2"></div>
                            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Core Modules</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">Everything Built Into One Platform</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
                        <FeatureModule
                            icon={Building2}
                            title="Property Management"
                            features={['Digital property profiles', 'Photo documentation', 'Lease management', 'File vault']}
                            variant="vertical"
                            iconBg="bg-gradient-to-br from-red-500 to-red-600"
                        />
                        <FeatureModule
                            icon={Users}
                            title="Tenant Operations"
                            features={['Tenant database', 'Communication history', 'Complaint tracking', 'Lease timelines']}
                            variant="vertical"
                            iconBg="bg-gradient-to-br from-red-500 to-red-600"
                        />
                        <FeatureModule
                            icon={BarChart3}
                            title="Financial Analytics"
                            features={['ROI calculations', 'Pricing benchmarks', 'Payment tracking', 'Vacancy warnings']}
                            variant="vertical"
                            iconBg="bg-gradient-to-br from-red-500 to-red-600"
                        />
                        <FeatureModule
                            icon={Clock}
                            title="Automated Reminders"
                            features={['SMS/WhatsApp alerts', 'Payment reminders', 'Maintenance updates', 'Scheduled notifications']}
                            variant="vertical"
                            iconBg="bg-gradient-to-br from-red-500 to-red-600"
                        />
                    </div>
                </div>

               <div className={`mt-20 lg:mt-28 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-black border border-red-500/20 shadow-2xl group">
                        
                        {/* Animated background */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600 rounded-full blur-3xl animate-pulse"></div>
                        </div>

                        {/* Compact Header */}
                        <div className="relative z-10 flex flex-col items-center mb-6">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                <Eye className="h-8 w-8" />
                            </div>
                            <div className="text-lg font-bold text-red-400 uppercase tracking-wide">
                                Our Vision
                            </div>
                        </div>

                        {/* Compact Title */}
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-snug relative z-10">
                            The Operating System for Property Owners
                        </h2>

                        {/* Our Vision */}
                        <div className="max-w-3xl mx-auto relative z-10">
                            <p className="text-base text-gray-100 leading-relaxed">
                                To become the <span className="font-semibold text-red-400">operating system for property owners</span> worldwide. 
                                We envision a future where <span className="font-semibold text-white">property management is digital, transparent, and 
                                automated</span>—where owners feel <span className="font-semibold text-red-400">directly connected to their assets</span> regardless 
                                of location. By replacing <span className="font-semibold text-white">Excel, WhatsApp, and uncertainty with real-time control</span>, 
                                PropGrowthX empowers property owners to build wealth with confidence.
                            </p>
                        </div>

                        {/* Interactive Accent Line */}
                        <div className="mt-8 flex justify-center relative z-10">
                            <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-400 rounded-full group-hover:w-20 transition-all duration-300"></div>
                        </div>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className={`mt-20 lg:mt-28 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center mb-12">
                        <div className="inline-block mb-3">
                            <div className="w-12 h-1 bg-red-600 mx-auto mb-2"></div>
                            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Our Philosophy</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">Why PropGrowthX Is Different</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-3xl mx-auto">
                        <PhilosophyCard
                            title="Presence Over Dashboard"
                            description="We're not another dashboard tool. We're a digital presence platform that makes owners feel connected to their property."
                            icon={Eye}
                            bgGradient="from-red-50 to-rose-50"
                            borderColor="border-red-200"
                            iconBg="bg-red-500"
                        />
                        <PhilosophyCard
                            title="Control Over Complexity"
                            description="Simplicity is our core principle. Every feature is designed to increase owner control and certainty, not add confusion."
                            icon={Zap}
                            bgGradient="from-red-50 to-rose-50"
                            borderColor="border-red-200"
                            iconBg="bg-red-500"
                        />
                        <PhilosophyCard
                            title="Workflows Over Analytics"
                            description="We prioritize automated workflows that save time—rent reminders, maintenance tracking, and financial updates happen automatically."
                            icon={Layers}
                            bgGradient="from-red-50 to-rose-50"
                            borderColor="border-red-200"
                            iconBg="bg-red-500"
                        />
                        <PhilosophyCard
                            title="Retention Over Growth Metrics"
                            description="We measure success by how much owners depend on PropGrowthX—it should become their operating system."
                            icon={Heart}
                            bgGradient="from-red-50 to-rose-50"
                            borderColor="border-red-200"
                            iconBg="bg-red-500"
                        />
                    </div>
                </div>

                {/* Enhanced Statistics Section */}
                <div className={`mt-24 lg:mt-32 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center mb-12">
                        <div className="inline-block mb-3">
                            <div className="w-12 h-1 bg-red-600 mx-auto mb-2"></div>
                            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Why Choose Us</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">Trusted by Property Owners Worldwide</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-4xl mx-auto">
                        <StatCard
                            icon={Building2}
                            number="500+"
                            label="Properties Managed"
                            description="Thousands of rental units managed globally"
                            delay="0"
                            variant="red"
                        />
                        <StatCard
                            icon={TrendingUp}
                            number="95%"
                            label="Rent Collection Rate"
                            description="Automated reminders improve payment compliance"
                            delay="150"
                            variant="red"
                        />
                        <StatCard
                            icon={Award}
                            number="24/7"
                            label="Platform Uptime"
                            description="99.5% guaranteed with secure data storage"
                            delay="300"
                            variant="red"
                        />
                    </div>
                </div>

                {/* Call to Action */}
                <div className={`mt-20 lg:mt-28 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">Ready to Transform Your Property Management?</h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">Join property owners who have replaced chaos with control. Start managing your properties with confidence today.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={handleGetStarted} className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg">
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            </div>
        </Layout>
    );
};

// Reusable Components

const ProblemCard = ({ icon: Icon, title, description, variant }: { 
    icon: React.ElementType, 
    title: string, 
    description: string,
    variant: 'red'
}) => {
    return (
        <div className="group relative bg-gradient-to-br from-red-50 to-red-50 p-5 rounded-xl border border-red-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                <div className="text-left">
                    <h3 className="text-base font-bold text-black mb-1">{title}</h3>
                    <p className="text-xs text-gray-600 leading-snug">{description}</p>
                </div>
            </div>
        </div>
    );
};

const SolutionCard = ({ icon: Icon, title, description, delay, bgColor, borderColor }: { 
    icon: React.ElementType, 
    title: string, 
    description: string,
    delay: string,
    bgColor: string,
    borderColor: string
}) => {
    return (
        <div 
            className={`group relative bg-white p-6 rounded-2xl shadow-md border ${borderColor} hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden h-full flex flex-col`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${bgColor} to-transparent`}></div>
            
            <div className="relative z-10 flex-1">
                <div className={`inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br ${bgColor} text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-black mb-3">{title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const EnhancedFeatureSection = ({ title, description, imageSrc, imageAlt, reversed, badge }: { 
    title: string, 
    description: string, 
    imageSrc: string, 
    imageAlt: string, 
    reversed: boolean,
    badge: { icon: React.ElementType, text: string }
}) => {
    const BadgeIcon = badge.icon;
    
    return (
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-12`}>
            <div className="flex-1">
                <div className="inline-flex items-center mb-4 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium">
                    <BadgeIcon className="w-4 h-4 mr-2" />
                    {badge.text}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-black leading-tight mb-6">
                    {title}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
            <div className="flex-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <img 
                        src={imageSrc} 
                        alt={imageAlt} 
                        className="w-full h-64 sm:h-72 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
                </div>
            </div>
        </div>
    );
};

const FeatureModule = ({ icon: Icon, title, features, variant, iconBg }: { 
    icon: React.ElementType, 
    title: string, 
    features: string[],
    variant: string,
    iconBg: string
}) => {
    return (
        <div className={`group relative bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col`}>
            <div className="flex items-start gap-4 mb-6">
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${iconBg} text-white flex-shrink-0`}>
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-black leading-tight">{title}</h3>
            </div>
            <ul className="space-y-2 flex-1">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const PhilosophyCard = ({ title, description, icon: Icon, bgGradient, borderColor, iconBg }: { 
    title: string, 
    description: string,
    icon: React.ElementType,
    bgGradient: string,
    borderColor: string,
    iconBg: string
}) => {
    return (
        <div className={`group relative bg-gradient-to-br ${bgGradient} p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col`}>
            <div className={`inline-flex items-center justify-center h-11 w-11 rounded-lg ${iconBg} text-white mb-4 group-hover:scale-110 transition-all duration-300`}>
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-black mb-3">{title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed flex-1">{description}</p>
        </div>
    );
};

const StatCard = ({ icon: Icon, number, label, description, delay, variant }: { 
    icon: React.ElementType, 
    number: string, 
    label: string, 
    description: string,
    delay: string,
    variant: 'red'
}) => {
    return (
        <div 
            className="group relative bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-500 h-full flex flex-col"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl"></div>
            
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-black mb-1">{number}</div>
            <div className="text-sm font-semibold text-black mb-2">{label}</div>
            <div className="text-xs text-gray-600 flex-1">{description}</div>
        </div>
    );
};

// Alert icon component
const AlertCircle = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default AboutUsPage;