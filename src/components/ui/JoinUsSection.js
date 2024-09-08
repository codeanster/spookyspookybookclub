import React from 'react';
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";

const JoinUsSection = ({ joinSectionRef, handleSubmit, name, setName, email, setEmail, submissionStatus }) => {
  return (
    <section ref={joinSectionRef} className="flex flex-col justify-between relative mb-12 text-center p-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full card border border-pink-500">
      {/* Cosmic horror overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
        <div className="absolute inset-0 animate-subtle-stars"></div>
        <div className="absolute inset-0 animate-ethereal-tendrils"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow">
        <h2 className="text-3xl font-semibold mb-6 text-pink-500">Ready to Face Your Fears?</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              className="bg-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
            Submit
          </Button>
        </form>
        {submissionStatus === 'success' && (
          <p className="mt-4 text-green-500">Successfully subscribed to the mailing list!</p>
        )}
        {submissionStatus === 'error' && (
          <p className="mt-4 text-red-500">An error occurred. Please try again.</p>
        )}
      </div>
    </section>
  );
};

export default JoinUsSection;
