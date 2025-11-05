'use client'
import Image from 'next/image';
import FadeInSection from '@/components/ui/FadeInItem';

export default function Story() {
  return (
    <section className='flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 py-12 bg-sky-50'>
      
      {/* Title */}
      <FadeInSection delay={0.2}>
        <h2 className='text-sky-600 text-4xl md:text-5xl font-serif text-center mb-10'>
          Our Story
        </h2>
      </FadeInSection>

      {/* Image */}
      <FadeInSection delay={0.4}>
        <div className='w-full max-w-[820px] rounded-xl overflow-hidden shadow-lg mb-10'>
          <Image
            alt='Our Story'
            src='https://res.cloudinary.com/dpniuvyf4/image/upload/v1749465876/my_folder/pjyuy75wdcfqe0ytbqif.jpg'
            width={0}
            height={0}
            sizes='100vw'
            className='w-full h-auto object-cover'
            loading='lazy'
          />
        </div>
      </FadeInSection>

      {/* Introduction */}
      <FadeInSection delay={0.6}>
        <p className='max-w-[700px] text-gray-800 md:text-lg font-medium text-center md:text-left mb-8'>
          We may be the first in the Barchi area of Kabul to implement a local online shopping idea. 
          Our goal is to allow the community to order anything they need through this website and have it delivered straight to their doorstep without stepping outside.
        </p>
      </FadeInSection>

      {/* Cards Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[820px] mb-12'>
        
        {/* How It Works */}
        <FadeInSection delay={0.8}>
          <div className='bg-white rounded-xl shadow-md p-6 min-h-[330px]'>
            <h3 className='text-black font-bold text-lg mb-3'>🛒 How It Works</h3>
            <ul className='text-gray-700 text-sm md:text-base list-disc list-inside space-y-2'>
              <li>Visit our website.</li>
              <li>Choose the products you need from the categories.</li>
              <li>Share your exact location via Google Map for accurate delivery.</li>
              <li>We collect the products from reliable shops in Barchi.</li>
              <li>Your order is delivered quickly and safely.</li>
            </ul>
          </div>
        </FadeInSection>

        {/* Payment Method */}
        <FadeInSection delay={1}>
          <div className='bg-white rounded-xl shadow-md p-6 min-h-[330px]'>
            <h3 className='text-black font-bold text-lg mb-3'>💰 Payment Method</h3>
            <p className='text-gray-700 text-sm md:text-base'>
              Currently, we use a simple and reliable method: Cash on Delivery (COD). You pay for your order in cash upon receiving it. This ensures trust and makes the process easy for everyone.
            </p>
          </div>
        </FadeInSection>

        {/* Our Goal */}
        <FadeInSection delay={1.2}>
          <div className='bg-white rounded-xl shadow-md p-6 min-h-[330px]'>
            <h3 className='text-black font-bold text-lg mb-3'>🎯 Our Goal</h3>
            <ul className='text-gray-700 text-sm md:text-base list-disc list-inside space-y-1'>
              <li>Save your time</li>
              <li>Make shopping easier</li>
              <li>Maintain high service quality in Barchi</li>
            </ul>
          </div>
        </FadeInSection>

        {/* Support Importance */}
        <FadeInSection delay={1.4}>
          <div className='bg-white rounded-xl shadow-md p-6 min-h-[330px]'>
            <h3 className='text-black font-bold text-lg mb-3'>🙌 Why Your Support Matters</h3>
            <p className='text-gray-700 text-sm md:text-base'>
              Since this is the first time such a service is being launched in Barchi, we rely on your support and trust to grow and improve the project, better addressing your needs. Together, we can create real change — for ourselves, our community, and our future.
            </p>
          </div>
        </FadeInSection>

      </div>
    </section>
  )
}
