import React from "react";
import backgroundImage from "@img/background2.webp";

const TechStackSection = ({ title, description, items }) => (
  <div className="mb-5 md:mb-7">
    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 mb-2 md:mb-3">
      {title}
    </h2>
    <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-2 md:mb-3">
      {description}
    </p>
    <ul className="list-disc list-inside text-sm md:text-base lg:text-lg text-gray-700">
      {items.map((item, index) => (
        <li key={index} className="mb-2">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const OverviewImage = ({ src, alt }) => (
  <div className="mb-5 md:mb-7 text-center">
    {src ? (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-md"
      />
    ) : (
      <div className="bg-gray-200 p-4 md:p-5 lg:p-6 rounded-lg shadow-md">
        <p className="text-sm md:text-base lg:text-lg text-gray-600">
          Overview image coming soon.
        </p>
      </div>
    )}
  </div>
);

export const SystemStack = () => {
  const overviewImageUrl = "";

  const techStack = [
    {
      title: "Infrastructure",
      description: "Stable and scalable foundation for service delivery",
      items: ["Load Balancer server (L3/4)", "DNS server"],
    },
    {
      title: "Cluster",
      description: "Container orchestration and service mesh management",
      items: ["Kubernetes", "Istio"],
    },
    {
      title: "Frontend",
      description: "Cross-platform mobile application development",
      items: ["React Native"],
    },
    {
      title: "Backend",
      description:
        "High-performance and efficient server-side logic processing",
      items: ["Rust axum", "Go fiber"],
    },
    {
      title: "Communication Methods",
      description: "Support for various client-server communication methods",
      items: [
        "REST (Go, Rust): Simple and scalable HTTP-based API",
        "gRPC (Go): High-performance RPC framework with protocol buffers",
        "JSON-RPC 2.0 (Rust): Lightweight remote procedure call protocol",
        "SSE (Rust): One-way real-time event stream from server to client",
      ],
    },
    {
      title: "Protocols",
      description: "Network protocols for secure and efficient data transfer",
      items: [
        "HTTPS: Encrypted secure communication",
        "HTTP/2: Improved performance with multiplexing support",
      ],
    },
    {
      title: "Database",
      description: "Support for various data models and use cases",
      items: ["PostgreSQL", "MySQL", "ScyllaDB", "Redis"],
    },
    {
      title: "Event Streaming Platform",
      description: "Real-time data streaming and event processing",
      items: ["Kafka Cluster (Strimzi)"],
    },
    {
      title: "CI/CD",
      description: "Automated build, test, and deployment processes",
      items: ["CI: Git Action (previously TravisCI)", "CD: ArgoCD"],
    },
    {
      title: "Observability",
      description: "System monitoring, logging, and distributed tracing",
      items: ["Grafana", "Prometheus", "Kiali", "Jaeger"],
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-3 py-4 sm:px-4 md:px-5 lg:px-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden mb-7 md:mb-9 lg:mb-12">
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Increased text size for mobile */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-5 md:mb-7 text-center cursor-pointer hover:text-gray-600 transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            Website Tech Stack
          </h1>

          <OverviewImage src={overviewImageUrl} alt="Tech Stack Overview" />

          {techStack.map((section, index) => (
            <TechStackSection
              key={index}
              title={section.title}
              description={section.description}
              items={section.items}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStack;
