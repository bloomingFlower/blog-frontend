import React from "react";
import backgroundImage from "@img/background2.webp";

// TechStackSection component modified
const TechStackSection = ({ title, description, items }) => (
  <div className="mb-4 md:mb-6">
    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-1 md:mb-2">{title}</h2>
    <p className="text-xs md:text-sm lg:text-base text-gray-600 mb-1 md:mb-2">{description}</p>
    <ul className="list-disc list-inside text-xs md:text-sm lg:text-base text-gray-700">
      {items.map((item, index) => (
        <li key={index} className="mb-1">{item}</li>
      ))}
    </ul>
  </div>
);

const OverviewImage = ({ src, alt }) => (
  <div className="mb-4 md:mb-6 text-center">
    {src ? (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-md"
      />
    ) : (
      <div className="bg-gray-200 p-3 md:p-4 lg:p-6 rounded-lg shadow-md">
        <p className="text-xs md:text-sm lg:text-base text-gray-600">Overview image coming soon.</p>
      </div>
    )}
  </div>
);

export const SystemStack = () => {
  const overviewImageUrl = "";

  // Tech stack information defined (with descriptions)
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
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-2 py-3 sm:px-3 md:px-4 lg:px-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden mb-6 md:mb-8 lg:mb-12">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <h1
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-6 text-center cursor-pointer hover:text-gray-600 transition-colors duration-300"
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