gA.reset = (function() {
  "use strict";

  var resetLevel = function() {

    this.update = function(noRespawn) {
      if(!noRespawn) {
        gA.player.state.spawnAni = new spawnAnimation();
        gA.player.state.respawn = true;
      }

      gA.player.state.alive = true;
      gA.player.state.jump = false;
      gA.player.state.wind = false;
      gA.player.state.grav = 1;
      gA.player.state.x = gA.level.player.x;
      gA.player.state.y = gA.level.player.y;

      if(!gA.level.player.color) {
        gA.player.state.R = gA.fgClr.R;
        gA.player.state.G = gA.fgClr.G;
        gA.player.state.B = gA.fgClr.B;
        gA.player.state.A = 1;
      } else {
        gA.player.state.R = gA.level.player.color[0];
        gA.player.state.G = gA.level.player.color[1];
        gA.player.state.B = gA.level.player.color[2];
        gA.player.state.A = gA.level.player.color[3];
      }

      gA.blood.arrayClear();
    };
  };

  function spawnAnimation() {
    this.s = 8;
    this.x = (gA.player.state.x+gA.tS/2)-this.s/2;
    this.y = (gA.player.state.y+gA.tS/2)-this.s/2;
    this.vx = 0;
    this.vy = 0;
    this.A = 1;
    this.R = gA.player.state.R;
    this.G = gA.player.state.G;
    this.B = gA.player.state.B;
    this.r = 96;
    this.color = 'rgba('+this.R+','+this.G+','+this.B+','+this.A+')';
    this.color2 = 'rgba('+gA.bgClr.R+','+gA.bgClr.G+','+gA.bgClr.B+','+this.A+')';
    this.theta1 = 0;
    this.theta2 = 22.5;

    this.particles = [];
    for(var i = 0; i < 16; i+=1) {
      this.particles.push({
        x: 0,
        y: 0
      });
    }

    function updateParticle(i, theta) {
      this.particles[i].x = this.x + this.r * Math.cos(Math.PI * theta / 180.0);
      this.particles[i].y = this.y + this.r * Math.sin(Math.PI * theta / 180.0);
      this.theta1 += 45;
      this.theta2 += 45;
      this.x = ( gA.player.state.x+gA.tS/2 )-this.s/2;
      this.y = ( gA.player.state.y+gA.tS/2 )-this.s/2;
    }

    this.update = function() {
      for(var i=0; i < this.particles.length; i+=1) {
        if(i <= 7) updateParticle.call(this, i, this.theta1);
        else if (i >= 8) updateParticle.call(this, i, this.theta2);
      }
      this.r -= 5;
      if(this.A > 0) this.A -= 0.025;
      if(this.r <= 0) this.r = 0;
      if(this.A <= 0) gA.player.state.respawn = false;
    };

    this.draw = function() {
      this.color = 'rgba('+this.R+','+this.G+','+this.B+','+this.A+')';
      this.color2 = 'rgba('+gA.bgClr.R+','+gA.bgClr.G+','+gA.bgClr.B+','+this.A+')';
      for(var i = 0; i < this.particles.length; i+= 1) {
        if(i <= 7) gA.ctx.g.fillStyle = this.color;
        else gA.ctx.g.fillStyle = this.color2;

        gA.ctx.g.fillRect(this.particles[i].x, this.particles[i].y, this.s, this.s);
      }
    };
  }

  return {
    level: new resetLevel()
  };

})();
