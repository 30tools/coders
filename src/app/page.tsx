import Link from "next/link";
import { ArrowRight, Code2, Zap, Shield, Users, Star, Github, MessageCircle, ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code2 className="h-6 w-6 text-black dark:text-white" />
            <span className="text-xl font-semibold text-black dark:text-white">Coders</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">by 30Tools</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d" 
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="Join Discussion"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
            <Link 
              href="https://github.com/30tools/coders" 
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight leading-tight">
            The Ultimate
            <br />
            <span className="text-gray-600 dark:text-gray-400">Developer Toolbox</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            30+ essential coding tools in one clean interface. No ads, no clutter, just pure developer productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Explore Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              href="https://github.com/30tools/coders"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200"
            >
              <Github className="mr-2 h-4 w-4" />
              View Source
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400 mt-8">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Free Forever
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Lightning Fast
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Privacy First
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Everything You Need to Code Smarter
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From code formatting to API testing, we've got the essential tools developers use daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-black dark:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              Popular Developer Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Most-used tools by our developer community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, index) => (
              <Link
                key={index}
                href={`/tools/${tool.slug}`}
                className="block p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center mb-3">
                  <tool.icon className="h-5 w-5 text-black dark:text-white mr-3" />
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200"
            >
              View All 30+ Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
            Join the Community
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with thousands of developers who use Coders daily. Share feedback, request features, and contribute to the project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://gist.github.com/SH20RAJ/9668ba4c5eb54da09b50b687b49a392d"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Join Discussion
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
            
            <Link
              href="https://github.com/30tools/coders"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg transition-colors duration-200"
            >
              <Github className="mr-2 h-4 w-4" />
              Contribute on GitHub
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Code2 className="h-5 w-5 text-black dark:text-white" />
              <span className="text-lg font-semibold text-black dark:text-white">Coders</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">by 30Tools</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link href="https://30tools.com" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors duration-200">
                30Tools
              </Link>
              <Link href="/tools" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors duration-200">
                All Tools
              </Link>
              <Link href="https://github.com/30tools/coders" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors duration-200">
                GitHub
              </Link>
              <Link href="mailto:sh20raj@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition-colors duration-200">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
    icon: Code2,
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
    icon: Code2,
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
    icon: Code2,
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
