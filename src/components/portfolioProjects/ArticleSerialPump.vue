<template>
	<h1 style="color: white">Serial Controlled Peristaltic Pump</h1>
	<article>
		<p>
			One of the projects I've worked on while being a embedded software contractor is to improve a
			peristaltic pump. I focused in on improving the pump's accuracy and flexibility.
		</p>
		<p>
			The first thing I did was to completely re-write the motor control software. Originally it was
			operated using a methodology of putting the motor at a specific voltage and then timing how
			long the motor would stay on for. This could then be used to calculate a dosage the pump had
			dispensed. This comes with some flaws. The system is highly dependant on the end speed of the
			motor and since the speed of the motor is equal to the voltage applied to the motor AND the
			resistance the fluid exerted on the motor you need to re-calibrate the motor if you change any
			variable in the system. Lifting head of the fluid, the viscosity of the fluid, the current
			momentum of the fluid, etc.
		</p>
		<p>
			The solution was fairly simple. Utilize the internal PPR signal the motor came with. The motor
			would output a pulse 6 times per revolution. With this signal you can determine exactly how
			much fluid has been dosed by keeping an accurate count of pulses. The particular motor I was
			developing on had a 6PPR motor with an 18:1 gearbox. This meant that for each revolution I had
			108 pulses to use for accuracy. This meant that just by using that already existing signal I
			could control the motor to an accuracy of 3.33 degrees which is significantly better than the
			previous solution. At this point I was able to control the pump as if it was running using a
			stepper motor.
		</p>
		<p>
			The next task I tackled was to improve the flexibility of the pump. The pump's current
			communication stack consisted of mostly single letter commands sent over SPI. An example would
			be, if you send the pump 'c' over SPI the motor would spin clockwise, if you send 'C' the
			motor would spin counter-clockwise. You could also set the speed by sending an 's' followed by
			three digits to represent a value between 0 and 100 to set the motor's voltage percent to.
			This method almost guarantees that a user will need to keep a reference sheet with them if
			they plan to control the pump.
		</p>
		<p>
			My solution to this problem was to write up a small scripting language that could be run on
			the pump. So now a user could send 'setEffort(50)' over a SPI bus and the motor would begin to
			operate at 50% voltage. I also provided the user the ability to send a '?' and every accepted
			internal command would be listed out. The system also allows for error handling. If the pump
			tried to run a script with an error, it could parse the error and give a human readable
			response to the user. This system creates an easier work environment for someone working with
			the pump.
		</p>
		<p>
			The video below shows a demo using PuTTy to communicate with the pump directly and it also
			shows a POC of an html control panel interfacing with the pump.
		</p>
	</article>
	<iframe
		class="youtubeVideo"
		src="https://www.youtube.com/embed/QWvHdG71N3s?si=_Dqpo1mw3YnCtOxp"
		title="YouTube video player"
		frameborder="0"
		allow="
			accelerometer;
			autoplay;
			clipboard-write;
			encrypted-media;
			gyroscope;
			picture-in-picture;
			web-share;
		"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
</template>

<script setup lang="ts"></script>

<style scoped>
@import './global.css';

article {
	color: white;
	max-width: 800px;

	margin: 30px;
}

.youtubeVideo {
	width: 60%;
	aspect-ratio: 1.77;
}
</style>
