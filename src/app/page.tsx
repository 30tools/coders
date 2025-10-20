import Link from "next/link";
import { ArrowRight, Code, Zap, Shield, Users, Star, Github, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Coders</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">by 30Tools</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="https://github.com/30tools/coders" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link 
              href="https://twitter.com/SH20RAJ" 
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight">
              The Ultimate
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {" "}Developer Toolbox
              </span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              30+ essential coding tools in one clean, fast interface. No ads, no clutter, just pure developer productivity. 
              Built by developers, for developers.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/tools"
                className="group inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Explore Tools
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="https://github.com/30tools/coders"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                Free Forever
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-green-500" />
                Lightning Fast
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-blue-500" />
                Privacy First
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Code Smarter
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From code formatting to API testing, we've got all the essential tools developers use daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200 hover:-translate-y-1">
                <div className="mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Popular Developer Tools
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Most-used tools by our developer community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, index) => (
              <Link
                key={index}
                href={`/tools/${tool.slug}`}
                className="group p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center mb-3">
                  <tool.icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-2 border-blue-600 dark:border-blue-400 hover:border-blue-700 dark:hover:border-blue-300 rounded-xl transition-colors"
            >
              View All 30+ Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Code Smarter?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who've already discovered the power of having all their essential tools in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white hover:bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Started - It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="https://github.com/30tools/coders"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <Github className="mr-2 h-5 w-5" />
              Star on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">Coders</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">by 30Tools</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="https://30tools.com" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">
                30Tools
              </Link>
              <Link href="/tools" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">
                All Tools
              </Link>
              <Link href="https://github.com/30tools/coders" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">
                GitHub
              </Link>
              <Link href="mailto:sh20raj@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 30Tools. Built with ❤️ for the developer community. Open source and free forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Code,
    title: "Code & Syntax",
    description: "Formatters, beautifiers, minifiers, and syntax converters for all major languages."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Client-side processing ensures instant results without server round-trips."
  },
  {
    icon: Shield,
    title: "Privacy First", 
    description: "Your code never leaves your browser. No tracking, no data collection."
  },
  {
    icon: Users,
    title: "Developer Focused",
    description: "Built by developers who understand your daily workflow and pain points."
  }
];

const popularTools = [
  {
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON with syntax highlighting.",
    icon: Code,
    slug: "json-formatter"
  },
  {
    name: "API Tester",
    description: "Test REST APIs with custom headers and authentication.",
    icon: Zap,
    slug: "api-tester"
  },
  {
    name: "Base64 Encoder",
    description: "Encode and decode Base64 strings and files instantly.",
    icon: Shield,
    slug: "base64-encoder"
  },
  {
    name: "Regex Tester",
    description: "Test regular expressions with real-time matching.",
    icon: Code,
    slug: "regex-tester"
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes for text and files.",
    icon: Shield,
    slug: "hash-generator"
  },
  {
    name: "URL Encoder",
    description: "Encode and decode URLs and query parameters safely.",
    icon: Zap,
    slug: "url-encoder"
  }
];
