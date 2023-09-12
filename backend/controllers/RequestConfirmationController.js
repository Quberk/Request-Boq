import Request from "../models/RequestModel.js";

export const ApproveRequest = async(req, res) => {
    
      const Status = "Diterima"

      // ==================== Mengupdate Status Field pada Request Table Database =======================
      try {
        // Cari data permintaan berdasarkan ID
        const existingRequest = await Request.findOne({
          where: {
            id: req.params.id,
          },
        });

        //Jika Request tidak ditemukan pada Database
        if (!existingRequest) {
          return res.status(404).json({ error: 'Request not found' });
        }

        // Update field Status pada data permintaan
        existingRequest.Status = Status;
        await existingRequest.save();

        res.status(200).json({ msg: 'Request Status Updated' });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
      }
};

export const RejectRequest = async(req, res) => {
    
    const Status = "Ditolak"

    // ==================== Mengupdate Status Field pada Request Table Database =======================
    try {
      // Cari data permintaan berdasarkan ID
      const existingRequest = await Request.findOne({
        where: {
          id: req.params.id,
        },
      });

      //Jika Request tidak ditemukan pada Database
      if (!existingRequest) {
        return res.status(404).json({ error: 'Request not found' });
      }

      // Update field Status pada data permintaan
      existingRequest.Status = Status;
      await existingRequest.save();

      res.status(200).json({ msg: 'Request Status Updated' });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Server error' });
    }
};